var test   = require('tape');
var Hapi   = require('hapi');
var JWT    = require('jsonwebtoken');
var secret = 'NeverShareYourSecret';

test('Should respond with 500 series error when validateFunc errs', async function (t) {

  var server = new Hapi.Server({ debug: false });
  try {
    await server.register(require('../'));
  } catch(err) {
    t.ifError(err, 'No error registering hapi-auth-jwt2 plugin');
  }
    server.auth.strategy('jwt', 'jwt', {
      key: secret,
      validateFunc: function (decoded, request, h) {
        if (decoded.id === 138) {
          throw new Error('ASPLODE');
        }
        return { response:  h.redirect('https://dwyl.com') }
      },
      verifyOptions: {algorithms: ['HS256']}
    });

    server.route({
      method: 'POST',
      path: '/privado',
      handler: function (req, h) { return 'PRIVADO'; },
      config: { auth: 'jwt' }
    });

    let options = {
      method: 'POST',
      url: '/privado',
      headers: {Authorization: JWT.sign({id: 138, name: 'Test'}, secret)}
    };

    let response = await server.inject(options);
      t.equal(response.statusCode, 500, 'Server returned 500 for validateFunc error');
    
    options.headers.Authorization = JWT.sign({id: 200, name: 'Test'}, secret);
    response = await server.inject(options);
      t.equal(response.statusCode, 302, 'Server redirect status code');
      t.equal(response.headers.location, 'https://dwyl.com', 'Server redirect header');
      t.end();

});