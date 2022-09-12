import fs from 'fs-extra'
import { Command } from 'commander'
import path from 'path'
import { cTemplatePath, packageJson, currentTemplatePath, cwdPath, supportCreateType } from './path'

function templateCommand (program: Command) {
  /** 创建项目 */
  program
    .command('create')
    .argument('<type>')
    .description('用于快速创建开发环境，提供开发构建脚手架')
    .action(async (type) => {
      if(supportCreateType.indexOf(type) === -1) {
        console.error('不支持的项目类型')
        return
      }
      try {
        /** 检查是否存在package.json文件，如果不存在则直接创建 */
        const stat = await fs.stat(packageJson)
        if(stat) {
          fs.copy(path.resolve(cTemplatePath, type), cwdPath)
          const editJson = await fs.readJSON(packageJson)
          editJson.scripts = editJson.scripts || {}
          editJson.scripts['dev'] = 'npx cpack dev'
          editJson.scripts['dev-server'] = 'npx cpack dev-server'
          editJson.scripts['build'] = 'npx cpack build'
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