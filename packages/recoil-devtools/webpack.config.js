const path = require('path');

const config = {
  entry: './index.d.tsx',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'lib/'),
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
          options: {
            silent: true,
            useBabel: true,
            babelOptions: {
              babelrc: false,
              compact: process.env.NODE_ENV === 'production',
              highlightCode: true,
            },
            babelCore: '@babel/core',
            useCache: true,
          }
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
