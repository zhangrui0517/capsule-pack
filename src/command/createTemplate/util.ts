import { Question } from 'inquirer'
import { forEach } from 'lodash-es'
import { parse, resolve } from 'path'
import ora from 'ora'
import { execa, ExecaError, ExecaReturnValue } from 'execa'
import fse from 'fs-extra'
import { QUOTATION_MARKS_REGEX } from '../../utils/index.js'

import {
	getDirFiles,
	getPkgPath,
	formatPath,
	getNpmInfo,
	pathExistSync,
	NPM_MIRROR_REGISTRY,
	getTemplateCacheDir
} from '../../utils/index.js'
import { inputTemplateLocationInquirer } from './inquirer.js'
import {
	CAPSULE_CONFIG_JS,
	EXCLUDE_TEMPLATE,
	readJsFile,
	getInquirerAnswer
} from '../../utils/index.js'
import { TemplateConfig } from '../../types'

const { statSync, copySync, readFile, writeFile, mkdirpSync } = fse

const templateFlagRegex = new RegExp(
	'\\$(\\w|\\d|[\u4e00-\u9fa5]|\\-|\\_)+\\$',
	'g'
)

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
			rootDir: getPkgPath(),
			filter: (file: string) => {
				return !EXCLUDE_TEMPLATE.includes(file)
			}
		}) || {}
	const { fileNames: customTemplate, filePaths: customTemplatePath } =
		getDirFiles('template', {
			filter: (file: string) => {
				return !EXCLUDE_TEMPLATE.includes(file)
			}
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

export async function replaceTemplateString(
	filePath: string | string[],
	extraChoices?: Question[]
) {
	const formatFilePath = Array.isArray(filePath) ? filePath : [filePath]
	try {
		const { questions, questionsFileData, questionsFilePath } =
			await getTemplateFileInquirer(formatFilePath)
		if (extraChoices?.length) {
			const choiceNames = questions.map((item) => item.name)
			forEach(extraChoices, (extraChoiceItem) => {
				const existIndex = choiceNames.indexOf(extraChoiceItem.name)
				if (existIndex > -1) {
					questions[existIndex] = extraChoiceItem
				} else {
					questions.push(extraChoiceItem)
				}
			})
		}
		if (questions.length) {
			const templateFieldAnswers = await getInquirerAnswer(questions)
			const formatFileData = questionsFileData.map((item) =>
				item.replace(templateFlagRegex, (match) => {
					return templateFieldAnswers?.[match] || match
				})
			)
			await Promise.all(
				questionsFilePath.map((filePathItem, index) =>
					writeFile(filePathItem, formatFileData[index]!)
				)
			)
		}
		return Promise.resolve(true)
	} catch (err) {
		console.error(err)
		return Promise.reject(false)
	}
}

export async function getTemplateFileInquirer(
	filePath: string | string[]
): Promise<{
	questions: Question[]
	questionsFileData: string[]
	questionsFilePath: string[]
}> {
	const formatFilePath = Array.isArray(filePath) ? filePath : [filePath]
	const questions: Array<{
		type: 'input'
		message: string
		name: string
	}> = []
	const questionsFileData: string[] = []
	const questionsFilePath: string[] = []
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
				questionsFileData.push(fielDataItem)
				questionsFilePath.push(formatFilePath[index]!)
				questions.push({
					type: 'input',
					message: flagItem,
					name: flagItem
				})
			})
		}
	})
	return {
		questions,
		questionsFileData,
		questionsFilePath
	}
}

export async function downloadTemplate(
	npmName: string,
	options: {
		restart?: boolean
		execaParams?: string[]
	} = {}
): Promise<ExecaReturnValue<string>> {
	const { restart, execaParams = [] } = options
	const templateCacheDir = getTemplateCacheDir()
	const templateCacheModuleDir = resolve(templateCacheDir, 'node_modules')
	if (!pathExistSync(templateCacheModuleDir)) {
		mkdirpSync(templateCacheModuleDir)
	}
	const spinner = ora('Downloading').start()
	const packageCommand = 'npm'
	const commandArgs = ['install', `${npmName}@latest`].concat(execaParams)
	try {
		const execaResult = await execa(packageCommand, commandArgs, {
			cwd: templateCacheDir
		})
		spinner.stop()
		console.log('Download success')
		return execaResult
	} catch (err) {
		spinner.stop()
		if (
			(err as ExecaError<string>).stderr.indexOf('network') > -1 &&
			!restart
		) {
			const restartSpinner = ora(
				'Network error. switch registry and download again'
			).start()
			try {
				const reExecaResult = await downloadTemplate(npmName, {
					restart: true,
					execaParams: ['--registry', NPM_MIRROR_REGISTRY]
				})
				restartSpinner.stop()
				return reExecaResult
			} catch (err) {
				restartSpinner.stop()
				console.error(err)
				return Promise.reject(err)
			}
		}
		return Promise.reject(err)
	}
}

/** 解析配置文件 */
export async function templateConfigController(
	configFilePath: string,
	toPath: string,
	filePaths: string[],
	templatePath: string
) {
	try {
		const configData = (await readJsFile(configFilePath)) as TemplateConfig
		const { npmName, inquirer, postScripts } = configData
		if (npmName) {
			const npmInfo = await getNpmInfo(npmName)
			if (npmInfo.status === 200) {
				const downloadResult = await downloadTemplate(npmName)
				if (!downloadResult.failed) {
					const templateCacheDir = getTemplateCacheDir([
						'node_modules',
						npmName,
						'template'
					])
					if (pathExistSync(templateCacheDir)?.isDirectory()) {
						copySync(templateCacheDir, toPath, copyWithoutCapsuleConfig)
						const { filePaths: npmFilePaths } =
							getDirFiles(templateCacheDir, {
								deep: true,
								filterType: 'file'
							}) || {}
						npmFilePaths?.length &&
							replaceTemplateString(npmFilePaths, inquirer || [])
					}
				}
			}
		} else {
			copySync(templatePath, toPath, copyWithoutCapsuleConfig)
			filePaths?.length &&
				(await replaceTemplateString(filePaths, inquirer || []))
		}
		/** todo: 增加包管理器选择 */
		await execa('pnpm', ['i'])
		/** 执行自定义脚本 */
		if (postScripts?.length) {
			for (let scriptItem of postScripts) {
				const withQuotationStrs = scriptItem.match(QUOTATION_MARKS_REGEX)
				let quotesMap: null | Record<string, any> = null
				if (withQuotationStrs) {
					forEach(withQuotationStrs, (quotationStr, index) => {
						const replaceKey = `quotes{${index}}`
						scriptItem = scriptItem.replace(quotationStr, replaceKey)
						quotesMap = quotesMap || {}
						quotesMap[replaceKey] = quotationStr
					})
				}
				let scriptArr = scriptItem.split(' ')
				if (quotesMap) {
					scriptArr = scriptArr.map((item) => quotesMap![item] || item)
				}
				const [commandName, ...params] = scriptArr
				if (commandName) {
					await execa(commandName, params)
				}
			}
		}
	} catch (err) {
		console.error(err)
	}
}

export async function createTemplate(templatePath: string) {
	const stat = statSync(templatePath)
	const { location } = await inputTemplateLocationInquirer()
	const formatLocation = formatPath(location)
	const baseName = parse(templatePath).base
	const toPath = resolve(formatLocation, `./${baseName}`)
	/** 模板是目录的处理 */
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
		/** 查找是否存在配置文件 */
		const configFileIndex = fileNames.indexOf(CAPSULE_CONFIG_JS)
		const toFilePaths = filePaths
			.map((item) => item.replace(templatePath, formatLocation))
			.filter((item) => !item.includes(CAPSULE_CONFIG_JS))
		if (configFileIndex !== -1) {
			templateConfigController(
				filePaths[configFileIndex]!,
				formatLocation,
				toFilePaths,
				templatePath
			)
		} else {
			/** 不存在配置文件，则直接复制到指定位置 */
			copySync(templatePath, formatLocation)
			replaceTemplateString(toFilePaths)
		}
	} else {
		/** 如果是文件，则直接复制到指定位置 */
		copySync(templatePath, toPath)
		await replaceTemplateString(toPath)
	}
}

export const copyWithoutCapsuleConfig = {
	filter: (sourcePath: string) => {
		const parsePath = parse(sourcePath).base
		return parsePath !== CAPSULE_CONFIG_JS
	}
}
