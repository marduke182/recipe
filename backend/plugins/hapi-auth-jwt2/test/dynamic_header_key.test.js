var test   = require('tape');
var Hapi   = require('hapi');
var JWT    = require('jsonwebtoken');
var secret = 'NeverShareYourSecret';

var keyDict = { 5678: secret };

test('When using a custom header key full token payload (header + payload + signature) is available to key lookup function using completeToken option', async function (t) {

  var server = new Hapi.Server();
  try {
    await server.register(require('../'));
  } catch(e) {
    t.ifError(err, 'No error registering hapi-auth-jwt2 plugin');
  }
  server.auth.strategy('jwt', 'jwt', {
    key: function (decoded) {
      console.log('decoded', keyDict[decoded.header.x5t]);
      return {key: keyDict[decoded.header.x5t]}; // Look dynamically for key based on JWT header field
    },
    complete: true,
    validateFunc: function (decoded, request) {
      return { valid: true };
    },
    verifyOptions: {algorithms: ['HS256']},
    headerKey: 'auths'
    
  });
  server.route({
    method: 'POST',
    path: '/',
    handler: function (request, h) { return 'Ok'; },
    config: { auth: 'jwt' }
  });

  var options = {
    method: 'POST',
    url: '/',
    headers: {auths: JWT.sign({ id: 1234 }, secret, { header: { x5t: 5678 } })} // set custom JWT header field "x5t"
  };

    const response = await server.inject(options);
    t.equal(response.statusCode, 200, 'Server returned 200 status');
    t.end();

});
