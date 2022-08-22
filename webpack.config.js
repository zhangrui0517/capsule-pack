const path = require('path')

module.exports = (webpackConfig) => {
  return {
    ...webpackConfig,
    entry: {
      index: path.resolve(process.cwd(), './test/index'),
    }
  }
}