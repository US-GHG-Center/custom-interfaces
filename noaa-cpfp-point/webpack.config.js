const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
module.exports = {
    entry: ['./script.js'],
    output: {
        filename: 'script.js',
        path: path.resolve(__dirname, 'dist'), // Output directory
    },
    module: {
        rules: [
            {
              test: /\.css$/, // Use regex to match .css files
              use: ['style-loader', 'css-loader'], // Loaders to process CSS
            },
            {
              test: /\.(png|jpe?g|gif)$/i,
              type: "asset/resource"
            },
        ],
    },
  plugins: [
    // Load environment variables from the .env file
    new Dotenv(),
    new HtmlWebpackPlugin({
      inject: false,
      template: './index.html',

      // Pass the full url with the key!
      publicUrl: process.env.PUBLIC_URL,
    }),
    new CopyPlugin({
      patterns: [
        { from: "./style.css", to: "./" },
        { from: "./noaa-logo.png", to: "./" },
        { from: "./marker-sdf.png", to: "./" },
        { from: "./co2", to: "./co2" },
        { from: "./ch4", to: "./ch4" },
      ],
    })
  ],
};
