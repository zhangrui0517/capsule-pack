const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base')

const devConfig = {
  mode: 'development',
  devServer: {
    contentBase: './dist',
    compress: true,
    hot: true,
    stats: {
      all: false
    }
  }
}

module.exports = merge(baseConfig, devConfig)