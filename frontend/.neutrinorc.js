const { resolve } = require('path');
module.exports = {
  use: neutrino => {
    neutrino.register(
      'jsonify',
      config => JSON.stringify(config, null, 2),
      'Output a JSON representation of the accumulated webpack configuration',
    );
    neutrino
      .use('@neutrinojs/airbnb', {
        eslint: {
          baseConfig: {
            extends: [ 'marduke182', 'prettier', 'prettier/react' ]
          },
          rules: {
            'object-curly-newline': 0,
          },
        },
      })
      .use('@neutrinojs/react', {
        html: {
          title: 'frontend',
        },
        hot: false,
        babel: {
          plugins: [
            [
              require.resolve('babel-plugin-import'),
              { libraryName: 'antd-mobile', libraryDirectory: 'es', style: 'css' },
            ],
          ],
        },
      })
      .use('@neutrinojs/jest', {
        testMatch: ['**/__tests__/**/*.test.js?(x)', '**/?(*.)(spec|test).js?(x)'],
        testRegex: '',
        setupTestFrameworkScriptFile: require.resolve('./jest/framework'),
        setupFiles: [require.resolve('./jest/setup')],
      });

    neutrino.config.resolve.modules.add(resolve('src'));

    neutrino.config.when(neutrino.options.command === 'start', config => {
      const protocol = config.devServer.get('https') ? 'https' : 'http';
      const url = `${protocol}://${config.devServer.get('public')}`;

      Object.keys(neutrino.options.mains).forEach(key => {
        config.entry(key).batch(entry => {
          entry
            .prepend(require.resolve('react-dev-utils/webpackHotDevClient'))
            .delete(require.resolve('webpack/hot/dev-server'))
            .delete(`${require.resolve('webpack-dev-server/client')}?${url}`);
        });
      });
    });
  },
};
