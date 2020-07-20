const path = require('path');

const config = {
  entry: './index.d.ts',
  output: {
    library: 'recoil-devtools-logger',
    libraryTarget: 'umd',
    filename: 'recoil-devtools-logger.js',
  },
  devtool: 'source-map',
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: [
        {
          loader: 'awesome-typescript-loader',
        },
      ],
      exclude: /(node_modules|bower_components)/
    }],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
};

module.exports = config;
