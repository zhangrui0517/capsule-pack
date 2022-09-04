import fs from 'fs-extra'
import { Command } from 'commander'
import { cTemplateProjectPath, packageJson, currentTemplatePath, cwdPath } from './path'

function templateCommand (program: Command) {
  /** 创建项目 */
  program
    .command('create')
    .description('用于快速创建开发环境，提供开发构建脚手架')
    .action(async () => {
      try {
        const stat = await fs.stat(packageJson)
        if(stat) {
          fs.copy(cTemplateProjectPath, cwdPath)
          const editJson = await fs.readJSON(packageJson)
          editJson.scripts = editJson.scripts || {}
          editJson.scripts.dev = 'npx webpack --config ./config/webpack.dev.ts'
          editJson && fs.writeJSON(packageJson, editJson, {
            spaces: '\t'
          }).then(() => {
            console.log('创建成功')
          })
        }
      } catch (err) {
        throw new Error(err as string)
      }
    })

  /** 创建自定义模板 */
  program
    .command('new')
    .description('用于创建用户自定义的模板，可直接传入一个路径或模板名称，如果传入模板名称，会到package.json所在的位置寻找template文件夹')
    .argument('<file>')
    .action(async (file) => {
      const filePath = `${currentTemplatePath}/${file}`
      try {
        const stat = await fs.stat(filePath)
        if(stat) {
          fs.copy(filePath, `${cwdPath}/${file}`)
        }
      } catch (err) {
        throw new Error(err as string)
      }
    })
}

export default templateCommand