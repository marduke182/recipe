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
            extends: ['marduke182', 'prettier', 'prettier/react'],
          },
          rules: {
            'object-curly-newline': 0,
          },
        },
      })
      .use('@neutrinojs/react', {
        html: {
          title: 'Recipes',
        },
        babel: {
          plugins: [
            [
              require.resolve('babel-plugin-import'),
              { libraryName: 'antd-mobile', libraryDirectory: 'lib', style: 'css' },
            ],
          ],
        },
      })
      .use('@marduke182/neutrinojs-jest-enzyme');

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
