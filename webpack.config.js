/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebPackPlugin = require('html-webpack-plugin')
const path = require('path')
const { displayName } = require('./app.json')
const result = require('dotenv').config()

if (result.error) {
  throw result.error
}

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    app: path.resolve(__dirname, 'index.tsx')
  },
  output: {
    path: path.resolve(__dirname, 'demo'),
    filename: 'index.bundle.js'
  },
  devtool: 'source-map',
  devServer: {
    static: path.resolve(__dirname, 'demo'),
    compress: true,
    port: 9000
  },
  module: {
    rules: [
      {
        test: /\.(tsx|ts|jsx|js|mjs)$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({ title: displayName })
  ],
  resolve: {
    extensions: [
      '.web.tsx',
      '.web.ts',
      '.tsx',
      '.ts',
      '.web.jsx',
      '.web.js',
      '.jsx',
      '.js'
    ], // read files in fillowing order
    alias: Object.assign({
      'react-native$': 'react-native-web'
    })
  }
}
