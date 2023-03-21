import { getDirFiles, getPkgPath, forFun, formatPath } from '../../utils/index.js'
import { inputTemplateLocation, getInquirerAnswer } from './inquirer.js'
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

export async function replaceTemplateString(filePath: string) {
	try {
		const fileData = readFileSync(filePath, {
			encoding: 'utf-8'
		})
		const templateFlags = fileData.match(templateFlagRegex)
		if (templateFlags) {
			const templateFields = await getInquirerAnswer(
				templateFlags.map((item) => ({
					type: 'input',
					message: item,
					name: item
				}))
			)
			const formatFileData = fileData.toString().replace(templateFlagRegex, (match) => {
				return templateFields?.[match] || match
			})
			writeFileSync(filePath, formatFileData)
		}
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
		console.log('toPath: ', toPath)
		const { filePaths } =
			getDirFiles(toPath, {
				deep: true,
				filterType: 'file'
			}) || {}
		filePaths &&
			forFun(filePaths, (pathItem) => {
				replaceTemplateString(pathItem)
			})
	} else {
		copySync(templatePath, toPath)
		await replaceTemplateString(toPath)
	}
}
