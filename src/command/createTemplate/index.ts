/**
 * Custom development template
 * Read the template under the template folder
 */
import type { Command } from 'commander'
import { createTemplate, getTemplateChoices } from './util.js'
import { selectTemplateInquirer } from './inquirer.js'

export function createTemplateCommand(program: Command): Command {
	program
		.command('create')
		.description('Quickly create development templates. You can choose inner templates or custom templates')
		.action(async () => {
			const { choices, paths } = getTemplateChoices()
			const templateAnswer = selectTemplateInquirer(choices)
			const { template } = await templateAnswer
			const selectTemplatePath = paths[Number(template[0])]
			if (selectTemplatePath) {
				createTemplate(selectTemplatePath)
			} else {
				console.error('Unable to obtain the correct template path')
			}
		})
	return program
}
