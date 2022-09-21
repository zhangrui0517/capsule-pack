import path from 'path'
/** 执行环境路径 */
export const projectPath = process.cwd()
/** 包路径 */
export const packagePath = path.resolve(__dirname.split('capsule-pack')[0]!, './capsule-pack')
/** 缓存目录 */
export function getCacheDirPath () {
  return path.resolve(projectPath, './node_modules/.cache/')
}
/** 打包产物目录 */
export function getOutputDirPath () {
  return path.resolve(projectPath, './dist')
}
/** 当前的执行环境下的package.json */
export function getPackageJson () {
  return path.resolve(projectPath, './package.json')
}
/** 当前执行环境下的template文件夹路径 */
export function getCurrentTemplatePath () {
  return path.resolve(projectPath, './template')
}
/** capsule-pack 的相关路径 */
export function getCpackPath () {
  return path.resolve(packagePath, './lib')
}
export function getCtemplatePath () {
  return path.resolve(packagePath, './template')
}
