require('../config/.env')('production')
const webpack = require('webpack')
const webpackConfig = require('../config/webpack.config')
const webpackConsole = require('./console')
const compiler = webpack(webpackConfig)

compiler.run((err, stats) => {
  const statsJSON = stats.toJson()
  /** 
   * err对象 不包含 编译错误，必须使用 stats.hasErrors() 单独处理;
   * err 对象只包含 webpack 相关的问题，例如配置错误等。
   */
  if(err || stats.hasErrors()) {
    webpackConsole(statsJSON)
  } else {
    webpackConsole(statsJSON)
  }
})