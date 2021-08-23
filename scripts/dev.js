require('../config/.env')('development')
const webpack = require('webpack')
const webpackConfig = require('../config/webpack.config')
const compiler = webpack(webpackConfig)
const WebpackDevServer = require('webpack-dev-server')
const webpackReport = require('./report')

const server = new WebpackDevServer(compiler, {
  contentBase: './dist',
  compress: true,
  hot: true,
  stats: {
    all: false
  }
})
compiler.hooks.done.tap('webpack-dev-server',stats => {
  webpackReport(stats)
  console.log('Starting server on http://localhost:8080')
})
server.listen(8080, '127.0.0.1')
