import inquirer, { Question } from 'inquirer'

export function getInquirerAnswer(config: Question[]) {
	return inquirer.prompt(config).catch((err) => {
		console.error(err)
	})
}
