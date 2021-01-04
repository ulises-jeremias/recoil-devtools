const webpack = require('webpack')
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const MiniCssWebpackPlugin = require('mini-css-extract-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const Dotenv = require('dotenv-webpack')

const commonPaths = require('./common-paths')
const PUBLIC_URL = process.env.PUBLIC_URL || require('../package.json').homepage || ''

const config = {
  output: {
    filename: 'assets/js/[name].[chunkhash:8].bundle.js',
    chunkFilename: 'assets/js/[name].[chunkhash:8].js',
    path: commonPaths.outputServerPath,
    publicPath: `${PUBLIC_URL}`,
  },
  mode: 'production',
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/,
        },
      },
    },
    minimize: true,
    minimizer: [
      new TerserWebpackPlugin({
        cache: true,
        parallel: true,
      }),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      PUBLIC_URL: JSON.stringify(PUBLIC_URL),
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production', // use 'production' unless process.env.NODE_ENV is defined
    }),
    new Dotenv({
      path: commonPaths.prodEnv,
    }),
    new MiniCssWebpackPlugin({
      filename: 'assets/css/[name].[hash].css',
      chunkFilename: 'assets/css/[id].[hash].css',
    }),
    new HtmlWebpackPlugin({
      template: commonPaths.template,
      title: 'myapp',
      base: `${PUBLIC_URL}`,
      filename: path.resolve(__dirname, commonPaths.templatesOutputServerPath, 'index.html'),
      favicon: commonPaths.favicon,
    }),
    new WebpackManifestPlugin({
      publicPath: PUBLIC_URL,
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
    new CleanWebpackPlugin({
      root: commonPaths.root,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: commonPaths.favicon,
          to: commonPaths.outputServerPath,
        },
      ],
    }),
  ],
}

module.exports = config
