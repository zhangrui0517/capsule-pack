import { existFile, existDir, dllConfigName, dllDirName,  webpackConfigDirPath, contextPath } from './'
import webpack from 'webpack'
import webpackDllConfig from '../config/webpack.dll'

/** 是否存在dll的webpack配置 */
export function isExistDllConfig () {
  return !!(existFile(webpackConfigDirPath, dllConfigName).length)
}

/** 是否存在dll产物 */
export function isExistDllFiles () {
  return !!(existDir(contextPath, dllDirName).length)
}

/** 生成dll产物 */
export function dllGenerator () {
  webpack(webpackDllConfig, (err, stats) => {
    const error = err || stats?.hasErrors()
    if (error) {
      console.error(error)
    } else {
      console.log('stats: ',stats)
    }
  })
}