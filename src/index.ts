import { Command } from 'commander'
import { getPkg } from './utils/index.js'
import { createTemplateCommand } from './command/index.js'

function runCpack() {
  const packageJson = getPkg()
  const program = new Command()
  program
    .name('capsule-pack')
    .description('Quickly create a project template')
    .version(packageJson.version)
  createTemplateCommand(program)
  program.parse()
}

export default runCpack
