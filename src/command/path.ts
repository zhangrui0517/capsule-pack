export const child_process = require('child_process')
export const path = require('path')
// 当前项目路径
export const rootPath = path.resolve(__dirname.split('node_modules')[0])
// 当前命令执行路径
export const cwdPath = process.cwd()

// 当前的执行环境下的package.json
export const packageJson = `${cwdPath}/package.json`

// 当前执行环境下的template文件夹路径
export const currentTemplatePath = `${cwdPath}/template`

// capsule-pack 的相关路径
export const cPackPath = `${rootPath}/node_modules/capsule-pack/src`
export const cTemplatePath = `${cPackPath}/template`