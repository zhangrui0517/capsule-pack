import path from 'path'
import child_process from 'child_process'
/** 执行环境路径 */
export const contextPath = path.resolve(child_process.execSync('npm root').toString(), '../')
/** 缓存目录 */
export const cacheDirPath = path.resolve(contextPath, './node_modules/.cache/')
/** 打包产物目录 */
export const outputDirPath = path.resolve(contextPath, './dist')