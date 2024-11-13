// config-overrides.js
const { override, addWebpackPlugin } = require('customize-cra');
const webpack = require('webpack');

module.exports = override(
  (config) => {
    // Modify the webpack config
    config.ignoreWarnings = [
      {
	module: /node_modules\/@turf\/jsts/,
	message: /Failed to parse source map/,
      },
    ];

    // Set source-map for better debugging
    config.devtool = 'eval-source-map';

    return config;
  }
);
