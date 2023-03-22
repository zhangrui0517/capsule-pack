import { getDirFiles, getPkgPath, forFun, formatPath } from '../../utils/index.js'
import { inputTemplateLocation, getInquirerAnswer } from './inquirer.js'
import { TEMPLATE_CONFIG_JSON } from '../../utils/index.js'
import { Answers } from 'inquirer'
import { parse, resolve } from 'path'
import fse from 'fs-extra'
const { readFileSync, writeFileSync, statSync, copySync } = fse

const templateFlagRegex = new RegExp('\\$(\\w|\\d|[\u4e00-\u9fa5])+\\$', 'g')

export function formatTemplateChoices(
	templateList: Array<{
		template: string[]
		templatePath: string[]
		type: string
	}>
) {
	const choices: string[] = []
	const paths: string[] = []
	forFun(templateList, (item) => {
		const { template, type, templatePath } = item
		forFun(template, (templateItem, index) => {
			choices.push(`${choices.length} ${templateItem} --> [${type}]`)
			paths.push(templatePath[index]!)
		})
	})
	return {
		choices,
		paths
	}
}

export function getTemplateChoices() {
	const { fileNames: innerTemplate, filePaths: innerTemplatePath } =
		getDirFiles('template', {
			rootDir: getPkgPath()
		}) || {}
	const { fileNames: customTemplate, filePaths: customTemplatePath } = getDirFiles('template') || {}
	const result = []
	if (innerTemplate?.length) {
		result.push({
			template: innerTemplate,
			templatePath: innerTemplatePath!,
			type: 'inner'
		})
	}
	if (customTemplate?.length) {
		result.push({
			template: customTemplate,
			templatePath: customTemplatePath!,
			type: 'custom'
		})
	}
	return formatTemplateChoices(result)
}

export async function replaceTemplateString(
	filePath: string,
	options: {
		withInquire?: boolean
		templateFieldMap?: Answers | void
	} = {}
) {
	const { withInquire, templateFieldMap } = options
	if (withInquire && templateFieldMap) {
		console.error("Can't use withInquire and inquirerList at same time!")
		return
	}
	if (!withInquire && !templateFieldMap) {
		return
	}
	try {
		const fileData = readFileSync(filePath, {
			encoding: 'utf-8'
		}).toString()
		let templateFieldAnswers: Answers | void = templateFieldMap
		if (withInquire) {
			const templateFlags = fileData.match(templateFlagRegex)
			if (templateFlags) {
				templateFieldAnswers = await getInquirerAnswer(
					templateFlags.map((item) => ({
						type: 'input',
						message: item,
						name: item
					}))
				)
			}
		}
		const formatFileData = fileData.replace(templateFlagRegex, (match) => {
			return templateFieldAnswers?.[match] || match
		})
		writeFileSync(filePath, formatFileData)
	} catch (err) {
		console.error(err)
	}
}

export async function createTemplate(templatePath: string) {
	const stat = statSync(templatePath)
	const { location } = await inputTemplateLocation()
	const formatLocation = formatPath(location)
	const baseName = parse(templatePath).base
	const toPath = resolve(formatLocation, `./${baseName}`)
	if (stat.isDirectory()) {
		copySync(templatePath, toPath)
		const { filePaths, fileNames } =
			getDirFiles(toPath, {
				deep: true,
				filterType: 'file'
			}) || {}
		const configFileIndex = (fileNames && fileNames.indexOf(TEMPLATE_CONFIG_JSON)) || -1
		if (configFileIndex > -1) {
			const configJson = fse.readJSONSync(filePaths![configFileIndex]!, {
				throws: false
			})
			if (configJson) {
				const answers = await getInquirerAnswer(configJson)
				forFun(filePaths!, (pathItem) => {
					replaceTemplateString(pathItem, {
						templateFieldMap: answers
					})
				})
			}
		}
	} else {
		copySync(templatePath, toPath)
		await replaceTemplateString(toPath, {
			withInquire: true
		})
	}
}
