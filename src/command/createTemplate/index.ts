/**
 * Custom development template
 * Read the template under the template folder
 */
import type { Command } from 'commander'
import inquirer from 'inquirer'
import { getTemplateChoices, createTemplate } from './util.js'

export function createTemplateCommand(program: Command): Command {
	program
		.command('create')
		.description(
			'Quickly create development templates. You can choose inner templates or custom templates'
		)
		.action(async () => {
			const { choices, paths } = getTemplateChoices()
			const answer = await inquirer
				.prompt([
					{
						type: 'list',
						name: 'template',
						message: 'Select the template you need',
						choices
					}
				])
				.catch((err) => {
					console.error(err)
				})
			const { template } = answer
			const selectTemplatePath = paths[Number(template[0])]
			if (selectTemplatePath) {
				createTemplate(selectTemplatePath)
			} else {
				console.error('Unable to obtain the correct template path')
			}
		})
	return program
}
