import { Command } from 'commander'
import webpackCommand from './webpackCommand'
import templateCommand from './templateCommand'

function runCpack() {
  const program = new Command()

  /** CLI 信息 */
  program.name('cpack').description('用于生成项目模板、组件模板、辅助工具').helpOption('-h', '查看帮助信息').addHelpCommand(false)

  templateCommand(program)
  webpackCommand(program)

  /** 解析命令 */
  program.parse()
}

export default runCpack
