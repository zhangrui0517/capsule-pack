/** node api */
import fs from 'fs-extra'
/** utils */
import { getCtemplatePath, getCurrentTemplatePath, projectPath } from '../utils/path'
import { packageJsonGenerator, copyCpackTemplate } from './utils'
/** type */
import type { Command } from 'commander'
import type { projectInquirerAnswers } from '../types'

function templateCommand(program: Command) {
  /** 创建项目 */
  program
    .command('create')
    .description('用于快速创建开发环境，提供开发构建脚手架')
    .action(() => {
      const dirList = fs.readdirSync(getCtemplatePath())
      const inquirer = require('inquirer')
        /** 不存在指定类型，则展示所有模板选项 */
        inquirer
          .prompt([
            {
              type: 'list',
              name: 'type',
              message: '请选择模板',
              choices: dirList
            },
            {
              type: 'list',
              name: 'packageManager',
              message: '使用的包管理器',
              choices: ['npm', 'yarn']
            }
          ])
          .then((answers: projectInquirerAnswers) => {
            const { type, packageManager } = answers
            console.info(`开始创建${type}模板`)
            packageJsonGenerator({type, packageManager}, () => {
              copyCpackTemplate(type, () => {
                console.info('模板创建成功')
              })
            })
          })
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
