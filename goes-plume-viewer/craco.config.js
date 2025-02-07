// craco.config.js
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Ignore warnings from @turf/jsts source map parsing
      webpackConfig.ignoreWarnings = [
        {
          module: /node_modules\/@turf\/jsts/,
          message: /Failed to parse source map/,
        },
      ];
      // Set source map for better debugging
      webpackConfig.devtool = 'eval-source-map';
      return webpackConfig;
    },
  },
};
