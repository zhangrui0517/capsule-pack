import path from 'path'
/** 执行环境路径 */
export const contextPath = process.cwd()
/** 缓存目录 */
export const cacheDirPath = path.resolve(contextPath, './node_modules/.cache/')
/** 打包产物目录 */
export const outputDirPath = path.resolve(contextPath, './dist')
/** webpack 配置目录 */
export const webpackConfigDirPath = path.resolve(contextPath, './config')