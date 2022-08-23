const path = require('path')
const HtmlWebpackPlugins = require('html-webpack-plugin')

module.exports = (webpackConfig) => {
  webpackConfig.plugins[0] = new HtmlWebpackPlugins({
    template: path.resolve(process.cwd(), './test/index.html')
  })
  return {
    ...webpackConfig,
    entry: {
      index: path.resolve(process.cwd(), './test/index'),
    }
  }
}