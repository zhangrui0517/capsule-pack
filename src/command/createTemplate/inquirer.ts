import inquirer, { QuestionCollection } from 'inquirer'

export async function selectTemplateInquirer(choices: string[]) {
	const answer = inquirer
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
	return answer
}

export async function inputTemplateLocation() {
	const answer = inquirer
		.prompt([
			{
				type: 'input',
				name: 'location',
				message: 'Template creation location. (default location is current path)'
			}
		])
		.catch((err) => {
			console.log(err)
		})
	return answer
}

export function getInquirerAnswer(config: QuestionCollection) {
	return inquirer.prompt(config).catch((err) => {
		console.error(err)
	})
}
