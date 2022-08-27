import { Configuration } from 'webpack'
import { merge } from 'webpack-merge'
import fs from 'fs'
import path from 'path'

/** 从package.json 中获取相关信息 */
export function getPackageJson () {
  const packageJson = fs.readFileSync(path.resolve(process.cwd(),'./package.json'))
  if(packageJson) {
    try {
      const packageJsonStr = packageJson.toString()
      return JSON.parse(packageJsonStr)
    } catch (err) {
      console.error(err)
    }
  }
  return null
}

/** 获取用户自定义的webpack配置文件 */
export function mergeExtraWebpackConfig (webpackConfig: Configuration) {
  const extraWebpack = importJs(path.resolve(process.cwd(),'./webpack.config.js'))
  if(extraWebpack) {
    switch(typeof extraWebpack) {
      case 'object':
        return merge(webpackConfig, extraWebpack)
      case 'function':
        return extraWebpack(webpackConfig)
    }
  }
  return webpackConfig
}

/** 
 * 引入外部js文件
 * @param {string} path 引入路径
 * @returns {object | function} 返回一份webpack配置或者一个回调函数用于处理webpack配置
 */
export function importJs(path: string) {
  try {
    const module = require(path)
    return module
  } catch(err) {
    console.error(err)
    return null
  }
}