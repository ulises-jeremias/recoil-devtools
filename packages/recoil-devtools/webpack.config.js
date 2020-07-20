const path = require('path');

const config = {
  entry: './index.d.ts',
  output: {
    filename: '[name].js',
  },
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.(ts|tsx)$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'tslint-loader',
      options: {
        failOnWarning: false,
        failOnError: true,
      },
    },
    {
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
