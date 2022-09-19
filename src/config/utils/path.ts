const path = require('path')
const child_process = require('child_process')

/** 执行环境路径 */
const projectPath = path.resolve(child_process.execSync('npm root').toString(), '../')
/** 缓存目录 */
const cacheDirPath = path.resolve(projectPath, './node_modules/.cache/')
/** 打包产物目录 */
const outputDirPath = path.resolve(projectPath, './dist')

module.exports = {
  projectPath,
  cacheDirPath,
  outputDirPath
}
