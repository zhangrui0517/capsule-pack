// node api
import fs from 'fs'
import path from 'path'
// utils
import { rootPath } from '.'
// types
import { CustomConfig } from '../types'

/** 从package.json 中获取相关信息 */
export function getPackageJson () {
  const packageJson = fs.readFileSync(path.resolve(rootPath,'./package.json'))
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

/** 获取自定义webpack配置 */
export function getCustomWebpack (): CustomConfig | null {
  const jsConfigPath = path.resolve(rootPath, './webpack.custom.js')
  // 先查找是否存在ts格式的webpack配置，没有再查找js格式的配置
  if(fs.existsSync(jsConfigPath)) {
    return importJs(jsConfigPath) || null
  }
  return null
}