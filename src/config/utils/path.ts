import path from 'path'
import child_process from 'child_process'
/** 执行环境路径 */
export const projectPath = path.resolve(child_process.execSync('npm root').toString(), '../')
/** 缓存目录 */
export const cacheDirPath = path.resolve(projectPath, './node_modules/.cache/')
/** 打包产物目录 */
export const outputDirPath = path.resolve(projectPath, './dist')