import { Answers, QuestionCollection } from 'inquirer'
import { forEach } from 'lodash-es'
import { parse, resolve } from 'path'
import { homedir } from 'os'
import ora from 'ora'
import { execa, ExecaError } from 'execa'
import fse from 'fs-extra'

import {
	getDirFiles,
	getPkgPath,
	formatPath,
	getNpmInfo,
	pathExistSync,
	NPM_MIRROR_REGISTRY
} from '../../utils/index.js'
import { inputTemplateLocation, getInquirerAnswer } from './inquirer.js'
import { CAPSULE_CONFIG_JS, readJsFile, switchRegistry } from '../../utils/index.js'
import { TemplateConfig } from '../../types'

const { statSync, copySync, readFile, writeFile, mkdirpSync } = fse

const templateFlagRegex = new RegExp('\\$(\\w|\\d|[\u4e00-\u9fa5]|\\-|\\_)+\\$', 'g')

export function formatTemplateChoices(
	templateList: Array<{
		template: string[]
		templatePath: string[]
		type: string
	}>
) {
	const choices: string[] = []
	const paths: string[] = []
	forEach(templateList, (item) => {
		const { template, type, templatePath } = item
		forEach(template, (templateItem, index) => {
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

export async function replaceTemplateString(filePath: string | string[]) {
	const formatFilePath = Array.isArray(filePath) ? filePath : [filePath]
	try {
		const { choices, choiceFileData, choicesFilePath } = await getTemplateFileChoices(formatFilePath)
		if (choices.length) {
			const templateFieldAnswers = await getInquirerAnswer(choices)
			const formatFileData = choiceFileData.map((item) =>
				item.replace(templateFlagRegex, (match) => {
					return templateFieldAnswers?.[match] || match
				})
			)
			Promise.all(choicesFilePath.map((filePathItem, index) => writeFile(filePathItem, formatFileData[index]!)))
		}
	} catch (err) {
		console.error(err)
	}
}

export async function getTemplateFileChoices(filePath: string | string[]): Promise<{
	choices: QuestionCollection<Answers>[]
	choiceFileData: string[]
	choicesFilePath: string[]
}> {
	const formatFilePath = Array.isArray(filePath) ? filePath : [filePath]
	const choices: QuestionCollection[] = []
	const choicesFilePath: string[] = []
	const choiceFileData: string[] = []
	const readFilePromise = formatFilePath.map((item) =>
		readFile(item, {
			encoding: 'utf-8'
		})
	)
	const readFileDatas = await Promise.all(readFilePromise)
	forEach(readFileDatas, (fielDataItem, index) => {
		const templateFlags = fielDataItem.match(templateFlagRegex)
		if (templateFlags) {
			forEach(templateFlags, (flagItem) => {
				choiceFileData.push(fielDataItem)
				choicesFilePath.push(formatFilePath[index]!)
				choices.push({
					type: 'input',
					message: flagItem,
					name: flagItem
				})
			})
		}
	})
	return {
		choices,
		choiceFileData,
		choicesFilePath
	}
}

export async function downloadTemplate(npmName: string, restart?: boolean) {
	const templateHomeDir = resolve(homedir(), '.capsule-pack', 'templates')
	if (!pathExistSync(templateHomeDir)) {
		mkdirpSync(templateHomeDir)
	}
	const spinner = ora('Downloading').start()
	const packageCommand = 'npm'
	const commandArgs = ['install', `${npmName}@latest`]
	try {
		await execa(packageCommand, commandArgs, {
			cwd: templateHomeDir
		})
		spinner.stop()
		console.log('download success')
	} catch (err) {
		spinner.stop()
		if ((err as ExecaError<string>).stderr.indexOf('network') > -1 && !restart) {
			const restartSpinner = ora('network error. switch registry and download again').start()
			await switchRegistry(NPM_MIRROR_REGISTRY)
			try {
				await downloadTemplate(npmName, true)
				restartSpinner.stop()
				console.log('redownload success')
			} catch (err) {
				restartSpinner.stop()
				console.error(err)
			}
		}
	}
}

export async function templateConfigController(filePaths: string[], configFilePath: string) {
	try {
		filePaths
		const configData = (await readJsFile(configFilePath)) as TemplateConfig
		const { npmName } = configData
		if (npmName) {
			const npmInfo = await getNpmInfo(npmName)
			if (npmInfo.status === 200) {
				downloadTemplate(npmName)
			}
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
		const { filePaths, fileNames } =
			getDirFiles(templatePath, {
				filterType: 'file',
				deep: true
			}) || {}
		if (!filePaths || !fileNames) {
			console.error('Template path read error, please check path is vaild')
			return
		}
		const configFileIndex = fileNames.indexOf(CAPSULE_CONFIG_JS)
		/** exist config file */
		if (typeof configFileIndex === 'number' && configFileIndex !== -1) {
			templateConfigController(filePaths, filePaths[configFileIndex]!)
		} else {
			copySync(templatePath, toPath)
			const toFilePaths = filePaths.map((item) => item.replace(templatePath, toPath))
			replaceTemplateString(toFilePaths)
		}
	} else {
		copySync(templatePath, toPath)
		await replaceTemplateString(toPath)
	}
}
