var Hapi   = require('hapi');
var secret = 'NeverShareYourSecret';

// for debug options see: http://hapijs.com/tutorials/logging
var server = new Hapi.Server({ debug: false });

var db = {
  "123": { allowed: true,  "name": "Charlie"  },
  "321": { allowed: false, "name": "Old Gregg"}
};

// defining our own validate function lets us do something
// useful/custom with the decodedToken before reply(ing)
var validate = async function (decoded, request) {
  if (db[decoded.id].allowed) {
    return {valid: true};
  }
  else {
    return {valid: false};
  }
};

var home = function(req, h) {
  return 'Hai!';
};

var privado = function(req, h) {
  return 'worked';
};

var sendToken = function(req, h) {
  return req.auth.token;
};

const init = async () =>{ 
  try {
    await server.register(require('../'));
    server.auth.strategy('jwt', 'jwt', {
      key: secret,
      validateFunc: validate,
      verifyOptions: { algorithms: [ 'HS256' ] } // only allow HS256 algorithm
    });

    server.auth.strategy('jwt-nourl', 'jwt', {
      key: secret,
      validateFunc: validate,
      verifyOptions: { algorithms: [ 'HS256' ] }, // only allow HS256 algorithm
      urlKey: false
    });

    server.auth.strategy('jwt-nocookie', 'jwt', {
      key: secret,
      validateFunc: validate,
      verifyOptions: { algorithms: [ 'HS256' ] }, // only allow HS256 algorithm
      cookieKey: false
    });

    server.auth.strategy('jwt-nourl2', 'jwt', {
      key: secret,
      validateFunc: validate,
      verifyOptions: { algorithms: [ 'HS256' ] }, // only allow HS256 algorithm
      urlKey: ''
    });

    server.auth.strategy('jwt-nocookie2', 'jwt', {
      key: secret,
      validateFunc: validate,
      verifyOptions: { algorithms: [ 'HS256' ] }, // only allow HS256 algorithm
      cookieKey: ''
    });

    server.route([
      { method: 'GET',  path: '/', handler: home, config: { auth: false } },
      { method: 'GET', path: '/token', handler: sendToken, config: { auth: 'jwt' } },
      { method: 'POST', path: '/privado', handler: privado, config: { auth: 'jwt' } },
      { method: 'POST', path: '/privadonourl', handler: privado, config: { auth: 'jwt-nourl' } },
      { method: 'POST', path: '/privadonocookie', handler: privado, config: { auth: 'jwt-nocookie' } },
      { method: 'POST', path: '/privadonourl2', handler: privado, config: { auth: 'jwt-nourl2' } },
      { method: 'POST', path: '/privadonocookie2', handler: privado, config: { auth: 'jwt-nocookie2' } },
      { method: 'POST', path: '/required', handler: privado, config: { auth: { mode: 'required', strategy: 'jwt' } } },
      { method: 'POST', path: '/optional', handler: privado, config: { auth: { mode: 'optional', strategy: 'jwt' } } },
      { method: 'POST', path: '/try', handler: privado, config: { auth: { mode: 'try', strategy: 'jwt' } } }
    ]);
  } catch(e) {
    throw e;
  }
}
init();

process.on('unhandledRejection', function(reason, p){
  console.log("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
  // application specific logging here
});

module.exports = server;
