/** node api */
import fs from 'fs-extra'
import path from 'path'
/** utils */
import inquirer from 'inquirer'
import execa from 'execa'
import { Listr } from 'listr2'
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
          const task = new Listr([
            {
              title: '处理package.json文件',
              task: () => {
                return packageJsonGenerator({ type, packageManager })
              }
            },
            {
              title: `创建${type}模板`,
              task: () => {
                return copyCpackTemplate(type)
              }
            },
            {
              title: '项目初始化',
              task: () => {
                return execa('npx', ['husky', 'install'])
              }
            }
          ])
          task.run().catch(err => {
            console.error(err)
          })
        })
    })

  /** 创建自定义模板 */
  program
    .command('new')
    .description('用于创建用户自定义的模板，可直接传入一个路径或模板名称，如果传入模板名称，会到package.json所在的位置寻找template文件夹')
    .argument('[file]')
    .action((/* file */) => {
      const templatePath = getCurrentTemplatePath()
      if (fs.existsSync(templatePath)) {
        const dirList = fs.readdirSync(templatePath)
        inquirer
          .prompt([
            {
              type: 'list',
              name: 'type',
              message: '请选择模板',
              choices: dirList
            }
          ])
          .then((answers: Record<string, any>) => {
            const { type } = answers
            fs.copySync(path.resolve(templatePath, type), path.resolve(projectPath, type))
            console.info('模板创建成功')
          })
      } else {
        throw new Error('没找到template目录，请确认目录下是否存在template文件夹')
      }
    })
}

export default templateCommand
