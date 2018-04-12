const rewireAntd = require('react-app-rewire-antd');
const rewireMobX = require('react-app-rewire-mobx');
const rewireStyledComponents = require('react-app-rewire-styled-components');
const rewireDefinePlugin = require('react-app-rewire-define-plugin');
const rewireBabelLoader = require('react-app-rewire-babel-loader');
const rewireProvidePlugin = require('react-app-rewire-provide-plugin');
const path = require('path');
const fs = require('fs');

// helpers
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = function override(config, env) {
  /* rewire antd */
  config = rewireAntd({
    '@primary-color': '#287DDC',
  })(config, env);

  config = rewireProvidePlugin(config, env, {
    'window.jQuery': 'jquery',
    $: 'jquery',
    jQuery: 'jquery',
    Popper: ['popper.js', 'default'],
  });

  config = rewireBabelLoader.include(
    config,
    resolveApp('node_modules/bootstrap')
  );

  config = rewireBabelLoader.include(
    config,
    resolveApp('node_modules/css-to-object')
  );

  /* rewire mobx */
  config = rewireMobX(config, env);

  /* rewire styled-components */
  config = rewireStyledComponents(config, env);
  /* rewire webpack definePlugin */
  config = rewireDefinePlugin(config, env, {
    'process.env.API_BASE_URL': JSON.stringify(
      process.env.API_BASE_URL || 'http://127.0.0.1:5000'
    ),
  });

  return config;
};
