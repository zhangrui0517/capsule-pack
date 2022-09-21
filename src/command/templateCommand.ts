/** node api */
import fs from 'fs-extra'
/** utils */
import { getCtemplatePath, getCurrentTemplatePath, projectPath } from '../utils/path'
import { packageJsonGenerator, copyCpackTemplate } from './utils'
/** type */
import type { Command } from 'commander'
import type { Answers } from 'inquirer'

function templateCommand(program: Command) {
  /** 创建项目 */
  program
    .command('create')
    .argument('[type]')
    .description('用于快速创建开发环境，提供开发构建脚手架')
    .action(type => {
      const dirList = fs.readdirSync(getCtemplatePath())
      /** 如果存在指定模板，则直接创建 */
      if (dirList.indexOf(type) > -1) {
        console.log(`开始创建${type}模板`)
        copyCpackTemplate(type, () => {
          console.log('模板创建成功')
          packageJsonGenerator(type)
        })
      } else {
        const inquirer = require('inquirer')
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
          .then((answers: Answers) => {
            const { type } = answers
            console.log(`开始创建${type}模板`)
            copyCpackTemplate(type, () => {
              console.log('模板创建成功')
              packageJsonGenerator(type)
            })
          })
      }
      console.log('项目创建完成')
    })

  /** 创建自定义模板 */
  program
    .command('new')
    .description('用于创建用户自定义的模板，可直接传入一个路径或模板名称，如果传入模板名称，会到package.json所在的位置寻找template文件夹')
    .argument('<file>')
    .action(async file => {
      const filePath = `${getCurrentTemplatePath()}/${file}`
      try {
        const stat = await fs.stat(filePath)
        if (stat) {
          fs.copy(filePath, `${projectPath}/${file}`)
        }
      } catch (err) {
        throw new Error(err as string)
      }
    })
}

export default templateCommand
