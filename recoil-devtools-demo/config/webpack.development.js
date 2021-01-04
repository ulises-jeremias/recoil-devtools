const webpack = require('webpack')
const path = require('path')
const Dotenv = require('dotenv-webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const MiniCssWebpackPlugin = require('mini-css-extract-plugin')

const commonPaths = require('./common-paths')

const HOST = process.env.HOST || 'localhost'
const PORT = process.env.PORT || 8091
const URL_BASE = process.env.URL_BASE || `http://${HOST}:${PORT}`

const config = {
  entry: ['react-hot-loader/patch'],
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    contentBase: commonPaths.outputPath,
    compress: true,
    historyApiFallback: true,
    hot: true,
    inline: true,
    port: PORT,
    headers: { 'Access-Control-Allow-Origin': '*' },
    public: URL_BASE,
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
