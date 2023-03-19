import { QuestionCollection } from 'inquirer'

export type TemplateConfig = Array<
	QuestionCollection & {
		flag?: string
	}
>
