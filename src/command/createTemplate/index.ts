/**
 * Custom development template
 * Read the template under the template folder
 */
import type { Command } from 'commander'
import inquirer from 'inquirer'
export function createTemplateCommand(program: Command): Command {
  program
    .command('create')
    .description(
      'Quickly create development templates. You can choose inner templates or custom templates'
    )
    .action(() => {
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'template',
            message: 'Select the template you need',
            choices: ['react', 'vue', 'web tools', 'components', 'node tools']
          }
        ])
        .then((answers) => {
          const { template } = answers
          console.log('template: ', template)
        })
        .catch((err) => {
          console.error(err)
        })
    })
  return program
}
