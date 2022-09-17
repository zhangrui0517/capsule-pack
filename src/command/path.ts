import child_process from 'child_process'
import path from 'path'
// 包路径
export const packagePath = path.resolve(__dirname.split('capsule-pack')[0]!, './capsule-pack')
// 项目路径
export const projectPath = path.resolve(child_process.execSync('npm root').toString(), '../')

// 当前的执行环境下的package.json
export const packageJson = path.resolve(projectPath, './package.json')
// 当前执行环境下的template文件夹路径
export const currentTemplatePath = path.resolve(projectPath, './template')

// capsule-pack 的相关路径
export const cPackPath = path.resolve(packagePath, './lib')
export const cTemplatePath = path.resolve(cPackPath, './template')