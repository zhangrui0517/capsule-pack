const child_process = require('child_process')
const path = require('path')
// 包路径
const packagePath = path.resolve(__dirname.split('capsule-pack')[0]!, './capsule-pack')
// 项目路径
const projectPath = path.resolve(child_process.execSync('npm root').toString(), '../')

// 当前的执行环境下的package.json
const packageJson = path.resolve(projectPath, './package.json')
// 当前执行环境下的template文件夹路径
const currentTemplatePath = path.resolve(projectPath, './template')

// capsule-pack 的相关路径
const cPackPath = path.resolve(packagePath, './lib')
const cTemplatePath = path.resolve(packagePath, './template')

module.exports = {
  packagePath,
  projectPath,
  packageJson,
  currentTemplatePath,
  cPackPath,
  cTemplatePath
}

/** 欺骗eslint，否则会报与另一个path文件声明冲突 */
export {}
