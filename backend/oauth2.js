const Boom = require('boom');
const Cryptiles = require('cryptiles');
const Hoek = require('hoek');
const Wreck = require('wreck');

module.exports = function (settings) {

  return async function (request, h) {

    const cookie = settings.cookie;
    const name = settings.name;
    const protocol = internals.getProtocol(request, settings);
    let query;
    let state;

    // Bail if the upstream service returns an error
    if (request.query.error === 'access_denied' || request.query.denied) {
      return Boom.internal(`App rejected: ${request.query.error_description || request.query.denied || 'No information provided'}`);
    }

    // If not https but cookie is secure, throw error
    if (protocol !== 'https' && settings.isSecure) {
      return Boom.internal('Invalid setting  - isSecure must be set to false for non-https server');
    }

    // Sign-in Initialization

    if (!request.query.code) {
      const nonce = Cryptiles.randomString(internals.nonceLength);
      query = internals.resolveProviderParams(request, settings.providerParams);

      if (settings.allowRuntimeProviderParams) {
        Hoek.merge(query, request.query);
      }

      query.client_id = settings.clientId;
      query.response_type = 'code';
      query.redirect_uri = internals.location(request, protocol, settings.location);
      query.state = nonce;

      if (settings.runtimeStateCallback) {
        const runtimeState = settings.runtimeStateCallback(request);
        if (runtimeState) {
          query.state += runtimeState;
        }
      }

      let scope = settings.scope || settings.provider.scope;
      if (typeof scope === 'function') {
        scope = scope(request);
      }
      if (scope) {
        query.scope = scope.join(settings.provider.scopeSeparator || ' ');
      }

      state = {
        nonce,
        query: request.query
      };

      h.state(cookie, state);
      return h.redirect(`${settings.provider.auth}?${internals.queryString(query)}`);
    }

    // Authorization callback

    state = request.state[cookie];
    if (!state) {
      return internals.refreshRedirect(request, name, protocol, settings);
    }

    h.unstate(cookie);

    const requestState = request.query.state || '';
    if (state.nonce !== requestState.substr(0, Math.min(requestState.length, internals.nonceLength))) {
      return Boom.internal('Incorrect ' + name + ' state parameter');
    }

    query = {
      grant_type: 'authorization_code',
      code: request.query.code,
      redirect_uri: internals.location(request, protocol, settings.location)
    };

    if (settings.provider.useParamsAuth) {
      query.client_id = settings.clientId;
      if (typeof settings.clientSecret === 'string') {
        query.client_secret = settings.clientSecret;
      }
    }

    const requestOptions = {
      payload: internals.queryString(query),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    if (!settings.provider.useParamsAuth) {
      requestOptions.headers.Authorization = 'Basic ' + (new Buffer(settings.clientId + ':' + settings.clientSecret, 'utf8')).toString('base64');
    }

    if (settings.provider.headers) {
      Hoek.merge(requestOptions.headers, settings.provider.headers);
    }

    if (typeof settings.clientSecret === 'object') {
      Hoek.merge(requestOptions, settings.clientSecret);
    }

    // Obtain token

    let payload = null;
    try {
      const { tokenRes, tokenPayload } = await Wreck.post(settings.provider.token, requestOptions);

      if (tokenRes.statusCode < 200 || tokenRes.statusCode > 299) {
        return Boom.internal(`Failed obtaining ${name} access token`, { payload, statusCode: tokenRes.statusCode });
      }

      payload = internals.parse(tokenPayload);
      if (payload instanceof Error) {
        return Boom.internal(`Received invalid payload from ${name} access token endpoint`, payload);
      }
    }
    catch (err) {
      return Boom.internal(`Failed obtaining ${name} access token`, err);
    }

    const credentials = {
      provider: name,
      token: payload.access_token,
      refreshToken: payload.refresh_token,
      expiresIn: payload.expires_in,
      query: state.query
    };

    if (!settings.provider.profile || settings.skipProfile) {
      return h.continue({ credentials, artifacts: payload });
    }

    // Obtain user profile

    const get = async function (uri, params) {

      const getOptions = {
        headers: {
          Authorization: 'Bearer ' + payload.access_token
        }
      };

      if (settings.profileParams) {
        Hoek.merge(params, settings.profileParams);
      }

      if (settings.provider.headers) {
        Hoek.merge(getOptions.headers, settings.provider.headers);
      }

      const getQuery = (params ? '?' + internals.queryString(params) : '');

      try {
        const { profileRes, profilePayload } = await Wreck[settings.provider.profileMethod](uri + getQuery, getOptions);
        if (profileRes.statusCode !== 200) {
          throw Boom.internal(`Failed obtaining ${name} user profile`, { payload: profilePayload, statusCode: profileRes.statusCOde });
        }

        profilePayload = internals.parse(profilePayload);
        if (profilePayload instanceof Error) {
          throw Boom.internal(`Received invalid payload from ${name} user profile`, profilePayload);
        }

        return profilePayload;
      }
      catch (err) {
        throw Boom.internal(`Failed obtaining ${name} user profile`, err);
      }
    };

    await settings.provider.profile.call(settings, credentials, payload, get);
    return h.continue({ credentials, artifacts: payload });
  };
};