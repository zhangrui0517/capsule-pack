require('../config/.env')('production')
const webpack = require('webpack')
const webpackConfig = require('../config/webpack.config')
const webpackReport = require('./report')
const compiler = webpack(webpackConfig)

compiler.run((err, stats) => {
  webpackReport(stats)
})