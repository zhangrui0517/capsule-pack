/** node api */
import fs from 'fs-extra'
/** utils */
import { Command } from 'commander'
import inquirer from 'inquirer'
import { cTemplatePath, currentTemplatePath, projectPath } from './path'
import { packageJsonGenerator, copyCpackTemplate } from './utils'

function templateCommand (program: Command) {
  /** 创建项目 */
  program
    .command('create')
    .argument('[type]')
    .description('用于快速创建开发环境，提供开发构建脚手架')
    .action(async (type) => {
      const dirList = fs.readdirSync(cTemplatePath)
      /** 如果存在指定模板，则直接创建 */
      if(dirList.indexOf(type) > -1) {
        copyCpackTemplate(type, () => {
          packageJsonGenerator(type)
        })
      } else {
        /** 不存在指定类型，则展示所有模板选项 */
        inquirer
          .prompt([
            {
              type: 'list',
              name: 'type',
              message: '请选择模板',
              choices: dirList
            }
          ])
          .then((answers) => {
            const { type } = answers
            copyCpackTemplate(type, () => {
              packageJsonGenerator(type)
            })
          })
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
          fs.copy(filePath, `${projectPath}/${file}`)
        }
      } catch (err) {
        throw new Error(err as string)
      }
    })
}

export default templateCommand