/** node api */
import fs from 'fs-extra'
import path from 'path'
import child_process from 'child_process'
/** utils */
import { Command } from 'commander'
import inquirer from 'inquirer'
import { cTemplatePath, packageJson, currentTemplatePath, cwdPath } from './path'

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
        fs.copy(path.resolve(cTemplatePath, type), cwdPath)
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
            fs.copy(path.resolve(cTemplatePath, type), cwdPath)
          })
      }
      /** 是否存在packageJson */
      fs.stat(packageJson, (err) => {
        if(err) {
          child_process.execSync('npm init -y')
        }
        const editJson = fs.readJsonSync(packageJson)
        editJson.scripts = editJson.scripts || {}
        editJson.scripts['dev'] = 'npx cpack dev'
        editJson.scripts['dev-server'] = 'npx cpack dev-server'
        editJson.scripts['build'] = 'npx cpack build'
        editJson && fs.writeJSON(packageJson, editJson, {
          spaces: '\t'
        }).then(() => {
          console.log('创建成功')
        })
      })
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