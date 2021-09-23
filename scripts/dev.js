require('../config/.env')('development')
const webpack = require('webpack')
const webpackDevConfig = require('../config/webpack.dev')
const compiler = webpack(webpackDevConfig)
const WebpackDevServer = require('webpack-dev-server')
const webpackReport = require('./report')
const defaultConfig = require('../config/default')

const server = new WebpackDevServer(compiler, webpackDevConfig.devServer || defaultConfig.devServer)
compiler.hooks.done.tap('done',stats => {
  webpackReport(stats)
  console.log('Starting server on http://localhost:8080')
})
server.listen(8080, '127.0.0.1')
