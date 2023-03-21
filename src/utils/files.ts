import { dirname as pathDirname, resolve, normalize, isAbsolute } from 'path'
import { fileURLToPath } from 'url'
import fse from 'fs-extra'
import { PACKAGE_NAME, forFun } from './index.js'

export function filename(importMeta: Record<string, any>) {
	return fileURLToPath(importMeta.url)
}

export function dirname(importMeta: Record<string, any>) {
	return pathDirname(filename(importMeta))
}

export function getPkgJSON() {
	const packageJsonPath = getPkgPath('package.json')
	const packageJson = fse.readJSONSync(packageJsonPath, { throws: false })
	if (!packageJson) {
		console.error('package.json not found. Please find it in the directory where package.json exists')
	}
	return packageJson
}

export function getPkgPath(filename?: string) {
	const currentDir = dirname(import.meta)
	const packageRoot = resolve(
		currentDir.split(PACKAGE_NAME)[0]!,
		filename ? `./${PACKAGE_NAME}/${filename}` : `./${PACKAGE_NAME}`
	)
	return packageRoot
}

export function getDirFiles(
	dirName: string,
	options: {
		rootDir?: string
		filterType?: 'dir' | 'file'
		deep?: boolean
	} = {}
):
	| {
			fileNames: string[]
			filePaths: string[]
	  }
	| undefined {
	const { rootDir, filterType, deep = false } = options
	const currentDirPath = isAbsolute(dirName) ? normalize(dirName) : resolve(rootDir || process.cwd(), `./${dirName}`)
	try {
		const fileDirentList = fse.readdirSync(currentDirPath, {
			withFileTypes: true
		})
		const filePaths: string[] = []
		const fileNames: string[] = []
		forFun(fileDirentList, (file) => {
			const fileName = file.name
			const filePath = resolve(currentDirPath, `./${file.name}`)
			switch (filterType) {
				case 'dir': {
					file.isDirectory() && fileNames.push(fileName) && filePaths.push(filePath)
					break
				}
				case 'file': {
					file.isFile() && fileNames.push(fileName) && filePaths.push(filePath)
					break
				}
				default: {
					filePaths.push(filePath)
					fileNames.push(fileName)
				}
			}
			if (deep && file.isDirectory()) {
				const { fileNames: subFileNames, filePaths: subFilePaths } =
					getDirFiles(filePath, {
						deep,
						filterType,
						rootDir
					}) || {}
				if (subFilePaths) {
					filePaths.push(...subFilePaths)
					fileNames.push(...subFileNames!)
				}
			}
		})
		return {
			fileNames,
			filePaths
		}
	} catch (err) {
		return undefined
	}
}

export function formatPath(path: string) {
	const trimPath = path.trim()
	if (trimPath) {
		return isAbsolute(trimPath) ? trimPath : resolve(process.cwd(), trimPath)
	} else {
		return process.cwd()
	}
}
