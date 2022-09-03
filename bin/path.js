const child_process = require('child_process')
const path = require('path')
// 当前项目路径
const rootPath = path.resolve(child_process.execSync('npm root').toString(), '../')
// 当前命令执行路径
const cwdPath = process.cwd()

// 当前的执行环境下的package.json
const packageJson = `${rootPath}/package.json`

// 当前执行环境下的template文件夹路径
const currentTemplatePath = `${rootPath}/template`

// capsule-pack 的相关路径
const cPackPath = `${rootPath}/node_modules/capsules-pack`
const cTemplatePath = `${cPackPath}/template`
const cTemplateProjectPath = `${cTemplatePath}/project`

module.exports = {
  rootPath,
  cwdPath,
  packageJson,
  currentTemplatePath,
  cPackPath,
  cTemplatePath,
  cTemplateProjectPath
}