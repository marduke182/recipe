var Hapi   = require('hapi');
var secret = 'NeverShareYourSecret';

// for debug options see: http://hapijs.com/tutorials/logging
var debug;
// debug = { debug: { 'request': ['error', 'uncaught'] } };
debug = { debug: false };
var server = new Hapi.Server(debug);

var sendToken = function(req, reply) {
  return req.auth.token || null;
};

var privado = function(req, reply) {
  return req.auth.credentials;
};

// defining our own validate function lets us do something
// useful/custom with the decodedToken before reply(ing)
var customVerifyFunc = function (decoded, request) {
  if(decoded.error) {
    throw new Error('customVerify fails!');
  }
  else if (decoded.custom_error) {
    throw new Error(decoded.custom_error);
  }
  else if (decoded.some_property) {
    return { valid: true, credentials: decoded};
  }
  else {
    return { valis: false };
  }
};

var customErrorFunc = function (errorContext) {
  var result = errorContext;
  if (errorContext.message.toString().search(/ignore/) >= 0) {
    result = null;
  } else if (errorContext.errorType === 'unauthorized') {
    result.message = "Invalid credentials mate";
  }
  return result;
};
const init = async() => {
  await server.register(require('../'));

  server.auth.strategy('jwt', 'jwt', {
    verifyFunc: customVerifyFunc, // no validateFunc or key required.
    errorFunc: customErrorFunc
  });

  server.route([
    { method: 'GET',  path: '/', handler: sendToken, config: { auth: false } },
    { method: 'GET', path: '/required', handler: privado, config: { auth: { mode: 'required', strategy: 'jwt' } } },
    { method: 'GET', path: '/optional', handler: privado, config: { auth: { mode: 'optional', strategy: 'jwt' } } },
    { method: 'GET', path: '/try', handler: privado, config: { auth: { mode: 'try', strategy: 'jwt' } } }
  ]);

};

init();

module.exports = server;