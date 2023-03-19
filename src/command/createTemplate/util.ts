import { getDirFiles, getPkgPath, forFun, formatPath } from '../../utils/index.js'
import { inputTemplateLocation } from './inquirer.js'
import { TemplateConfig } from '../../types'
import { parse, resolve } from 'path'
import fse from 'fs-extra'

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
	const { files: innerTemplate, filesPath: innerTemplatePath } =
		getDirFiles({
			dirName: 'template',
			rootDir: getPkgPath()
		}) || {}
	const { files: customTemplate, filesPath: customTemplatePath } =
		getDirFiles({
			dirName: 'template'
		}) || {}
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

export function copyAndFormatTemplateFile(
	filePath: string,
	filesToPath: string,
	config?: TemplateConfig,
	options: {
		flag?: string
	} = {}
) {
	const { flag = '$' } = options
	const rs = fse.createReadStream(filePath, {
		encoding: 'utf-8',
		emitClose: true,
		highWaterMark: 1
	})
	const ws = fse.createWriteStream(filesToPath, {
		emitClose: true
	})
	let cacheChunk = ''
	rs.on('data', (chunk) => {
		if (chunk === flag) {
			if (cacheChunk) {
				cacheChunk += chunk
				const regex = new RegExp(`\\${flag}(\\w|\\d|[\u4e00-\u9fa5])+\\${flag}`, 'g')
				if (regex.test(cacheChunk)) {
					cacheChunk = cacheChunk.replace(regex, 'changeName')
				}
				!ws.write(cacheChunk) && rs.pause()
				cacheChunk = ''
				return
			}
			cacheChunk += chunk
			return
		}
		if (cacheChunk) {
			cacheChunk += chunk
			return
		}
		if (!ws.write(chunk)) {
			rs.pause()
		}
	})
	ws.on('drain', () => {
		rs.resume()
	})
}

export async function createTemplate(templatePath: string) {
	const stat = fse.statSync(templatePath)
	if (stat.isDirectory()) {
		const templateFiles = getDirFiles({
			dirName: templatePath
		})
		console.log('templateFiles: ', templateFiles)
	} else {
		const { location } = await inputTemplateLocation()
		const fileName = parse(templatePath).base
		const filesToPath = resolve(formatPath(location), `./${fileName}`)
		copyAndFormatTemplateFile(templatePath, filesToPath, [
			{
				flag: '$name$',
				message: 'sss',
				type: 'list'
			}
		])
	}
}
