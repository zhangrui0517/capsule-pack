import path from 'path'
/** 执行环境路径 */
export const contextPath = process.cwd()
/** 缓存目录 */
export const cacheDirPath = path.resolve(contextPath, './node_modules/.cache/')
/** dll 目录 */
export const dllDirPath = path.resolve(contextPath, './dlls')
/** dll 配置文件名称 */
export const dllConfigName = 'webpack.dll.ts'
/** dll 配置目录名称 */
export const dllDirName = 'dlls'
/** 打包产物目录 */
export const outputDirPath = path.resolve(contextPath, './dist')
/** webpack 配置目录 */
export const webpackConfigDirPath = path.resolve(contextPath, './config')