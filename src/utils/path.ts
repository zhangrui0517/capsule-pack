import path from 'path'
/** 执行环境路径 */
export const projectPath = process.cwd()
/** 缓存目录 */
export const cacheDirPath = path.resolve(projectPath, './node_modules/.cache/')
/** 打包产物目录 */
export const outputDirPath = path.resolve(projectPath, './dist')
/** 包路径 */
export const packagePath = path.resolve(__dirname.split('capsule-pack')[0]!, './capsule-pack')
/** 当前的执行环境下的package.json */
export const packageJson = path.resolve(projectPath, './package.json')
/** 当前执行环境下的template文件夹路径 */
export const currentTemplatePath = path.resolve(projectPath, './template')
/** capsule-pack 的相关路径 */
export const cPackPath = path.resolve(packagePath, './lib')
export const cTemplatePath = path.resolve(packagePath, './template')
