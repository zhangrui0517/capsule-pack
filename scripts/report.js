const { statsConfig } = require('./util')
/**
 * @param { object } stats webpack编译后的输出结果JSON
 */
function webpackReport(stats) {
  const statsJSON = stats.toJson(statsConfig)
  const { outputPath, builtAt, time, version, entrypoints, warningsCount, warnings, errors, errorsCount, assets } = statsJSON
  console.log(`webpack 版本: ${version}`)
  console.log(`构建时间: ${new Date(builtAt).toLocaleString()}`)
  console.log(`构建耗时: ${time/1000}秒`)
  console.log(`构建文件输出目录: ${outputPath}`)
  console.log(`警告数量: ${warningsCount}`)
  if(errorsCount) {
    _reportError(errors)
  } else {
    _reportAsset({ entrypoints, assets })
  }
}

/**
 * 生成报告所需信息
 * @param { object } assetsInfo 
 */
function _reportAsset (assetsInfo) {
  const { entrypoints, assets } = assetsInfo
  for(let entryName in entrypoints) {
    const currentEntry = entrypoints[entryName]
    console.log(`入口 ${entryName}`)
    console.log(`构建文件列表`)
    const assets = currentEntry.assets
    assets.forEach(assetsItem => {
      console.log(`${assetsItem.name} ${assetsItem.size}`)
    })
    const auxiliaryAssets = currentEntry.auxiliaryAssets
    if(auxiliaryAssets.length) {
      console.log('静态文件列表')
      auxiliaryAssets.forEach(staticItem => {
        console.log(`${staticItem.name} ${staticItem.size}`)
      })
    }
  }
}

/**
 * 生成错误报告
 * @param { array } errors 
 */
function _reportError(errors) {

}

module.exports = webpackReport