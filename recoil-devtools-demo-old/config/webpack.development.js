const webpack = require('webpack')
const path = require('path')
const Dotenv = require('dotenv-webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const MiniCssWebpackPlugin = require('mini-css-extract-plugin')

const commonPaths = require('./common-paths')

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const URL_BASE = process.env.URL_BASE || `http://${HOST}:${DEFAULT_PORT}`;
const isUnspecifiedHost = HOST === '0.0.0.0' || HOST === '::';
const prettyHost = isUnspecifiedHost ? 'localhost' : HOST;

const config = {
  entry: ['react-hot-loader/patch'],
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    contentBase: commonPaths.outputPath,
    compress: true,
    historyApiFallback: true,
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    host: HOST,
    port: DEFAULT_PORT,
    public: `http://${prettyHost}:${DEFAULT_PORT}` 
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
    }),
    new Dotenv({
      path: commonPaths.devEnv,
    }),
    new MiniCssWebpackPlugin({
      filename: 'assets/css/[name].css',
      chunkFilename: 'assets/css/[id].css',
    }),
    new HtmlWebpackPlugin({
      template: commonPaths.template,
      base: URL_BASE,
      title: 'myapp',
      filename: path.resolve(__dirname, commonPaths.outputPath, 'index.html'),
      favicon: commonPaths.favicon,
    }),
    new WebpackManifestPlugin({
      publicPath: URL_BASE,
      seed: {
        name: 'react-base-project',
        short_name: 'react-base-project',
        start_url: 'index.html',
        display: 'standalone',
        icons: [
          {
            src: 'favicon.ico',
            sizes: '512x512',
            type: 'image/x-icon',
          },
        ],
        background_color: '#4e0041',
        theme_color: '#4e0041',
      },
      generate: (seed, files, entrypoints) => {
        const manifestFiles = files.reduce((manifest, file) => {
          manifest[file.name] = file.path
          return manifest
        }, seed)
        const entrypointFiles = entrypoints.main.filter((fileName) => !fileName.endsWith('.map'))

        return {
          files: manifestFiles,
          entrypoints: entrypointFiles,
        }
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: commonPaths.favicon,
          to: commonPaths.outputPath,
        },
      ],
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
}

module.exports = config
