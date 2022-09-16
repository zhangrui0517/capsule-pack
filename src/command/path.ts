export const child_process = require('child_process')
export const path = require('path')
// 当前项目路径
export const rootPath = path.resolve(__dirname.split('node_modules')[0])
// 当前命令执行路径
export const cwdPath = process.cwd()

// 当前的执行环境下的package.json
export const packageJson = path.resolve(cwdPath, './package.json')
// 当前执行环境下的template文件夹路径
export const currentTemplatePath = path.resolve(cwdPath, './template')

// capsule-pack 的相关路径
export const cPackPath = path.resolve(rootPath, './node_modules/capsule-pack/lib')
export const cTemplatePath = path.resolve(cPackPath, './tempalte')