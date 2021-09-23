require('../config/.env')('production')
const webpack = require('webpack')
const webpackProdConfig = require('../config/webpack.prod')
const webpackReport = require('./report')
const compiler = webpack(webpackProdConfig)

compiler.run((err, stats) => {
  webpackReport(stats)
})