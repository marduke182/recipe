const { Neutrino } = require('neutrino');

// eslint-disable-next-line babel/new-cap
module.exports = Neutrino()
  .use('.neutrinorc.js')
  .call('jsonify');
