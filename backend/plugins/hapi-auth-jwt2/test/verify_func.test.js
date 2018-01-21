var test   = require('tape');
var JWT    = require('jsonwebtoken');
// var secret = 'NeverShareYourSecret';

var server = require('./verify_func_server'); // test server which in turn loads our module

test("Access a route that has no auth strategy", async function(t) {
  var options = {
    method: "GET",
    url: "/"
  };
  // server.inject lets us simulate an http request
  const response = await server.inject(options);
    t.equal(response.statusCode, 200, "GET / still works without token.");
    t.end();
});

test("customVerify simulate error condition", async function(t) {
  var payload = { id: 123, "name": "Charlie", error: true }
  var token = JWT.sign(payload, 'SecretDoesNOTGetVerified');
  var options = {
    method: "GET",
    url: "/required",
    headers: { authorization: "Bearer " + token  }
  };
  // server.inject lets us simulate an http request
  const response = await server.inject(options);
    t.equal(response.statusCode, 500, "customVerify force error");
    t.end();
});

test("customVerify with fail condition", async function(t) {
  var payload = { id: 123, "name": "Charlie", some_property: false }
  var token = JWT.sign(payload, 'SecretDoesNOTGetVerified');
  var options = {
    method: "GET",
    url: "/required",
    headers: { authorization: "Bearer " + token  }
  };
  // server.inject lets us simulate an http request
  const response = await server.inject(options);
    t.equal(response.statusCode, 401, "GET /required with customVerify rejected");
    t.end();
});

test("Custom Verification in 'try' mode ", async function(t) {
  var payload = { id: 123, "name": "Charlie", some_property: true }
  var token = JWT.sign(payload, 'SecretDoesNOTGetVerified');
  var options = {
    method: "GET",
    url: "/try",
    headers: { authorization: "Bearer " + token  }
  };
  // server.inject lets us simulate an http request
  const response = await server.inject(options);
    t.equal(response.result.id, payload.id, 'Decoded JWT returned by handler');
    t.equal(response.statusCode, 200, "GET /try bypasses verification");
    t.end();
});

test("Custom Verification in 'optional' mode ", async function(t) {
  var payload = { id: 234, "name": "Oscar", some_property: true  }
  var token = JWT.sign(payload, 'SecretDoesNOTGetVerified');
  var options = {
    method: "GET",
    url: "/optional",
    headers: { authorization: "Bearer " + token  }
  };
  // server.inject lets us simulate an http request
  const response = await server.inject(options);
    t.equal(response.result.id, payload.id, 'Decoded JWT returned by handler');
    t.equal(response.statusCode, 200, "GET /optional bypasses verification");
    t.end();
});

test("Custom Verification in 'required' mode ", async function(t) {
  var payload = { id: 345, "name": "Romeo", some_property: true }
  var token = JWT.sign(payload, 'AnyStringWillDo');
  var options = {
    method: "GET",
    url: "/required",
    headers: { authorization: "Bearer " + token  }
  };
  // server.inject lets us simulate an http request
  const response = await server.inject(options);
    // console.log(response.result);
    var credentials = JSON.parse(JSON.stringify(response.result));
    t.equal(credentials.id, payload.id, 'Decoded JWT is available in handler');
    t.equal(response.statusCode, 200, "GET /required bypasses verification");
    t.end();
});