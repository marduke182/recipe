require('dotenv').config();
require('./db/models');

const Hapi = require('hapi');
const Boom = require('boom');
const glob = require('glob');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const pkg = require('./package');

// const jwtValidate = require('./jwt/validate');
const config = require('./config');

const init = async () => {
  const server = Hapi.server({
    debug: {
      log: ['*'],
      request: ['*'],
    },
    load: {
      sampleInterval: 1000,
    },
    port: 3000,
    routes: {
      validate: {
        failAction(request, h, err) {
          request.log(['validation', 'error'], err);
          throw Boom.badRequest('Invalid request payload input');
        },
      },
    },
  });

  const swaggerOptions = {
    info: {
      title: 'Recipe API Documentation',
      version: pkg.version,
    },
    jsonEditor: true,
    // documentationPage: false,
    // swaggerUI: false,
  };

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);
  /*await server.register(require('./plugins/hapi-auth-jwt2'));

  server.auth.strategy('jwt', 'jwt',
    {
      key: config.jwtToken,          // Never Share your secret key
      validateFunc: jwtValidate ,            // validate function defined above
      verifyOptions: {
        algorithms: [ 'HS256' ] // pick a strong algorithm
      }
    }
  );

  server.auth.default('jwt');*/

  // Look through the routes in
  // all the subdirectories of routes
  // and create a new route for each
  glob
    .sync('/routes/**/*.js', {
      root: __dirname,
    })
    .forEach(file => {
      const route = require(file);
      server.route(route);
    });

  await server.start();
  return server;
};

init()
  .then(server => server.log('Server started...'))
  .catch(err => console.log(err));
