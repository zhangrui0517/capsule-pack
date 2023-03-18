import { dirname as pathDirname, resolve, normalize } from 'path'
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
		console.error(
			'package.json not found. Please find it in the directory where package.json exists'
		)
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

export function getDirFiles(options: {
	dirName: string
	rootDir?: string
	filterType?: 'dir' | 'file'
	absolute?: boolean
}):
	| {
			files: string[]
			filesPath: string[]
	  }
	| undefined {
	const { dirName, rootDir, filterType, absolute } = options
	const currentDirPath = absolute
		? normalize(dirName)
		: resolve(rootDir || process.cwd(), `./${dirName}`)
	try {
		const fileList = fse.readdirSync(currentDirPath)
		const filesPath: string[] = []
		const filterIndex: number[] = []
		forFun(fileList, (file, index) => {
			const filePath = resolve(currentDirPath, `./${file}`)
			if (filterType) {
				const stat = fse.statSync(filePath)
				if (stat.isDirectory()) {
					filterType === 'dir'
						? filesPath.push(filePath)
						: filterIndex.push(index)
				} else {
					filterType === 'file'
						? filesPath.push(filePath)
						: filterIndex.push(index)
				}
			} else {
				filesPath.push(filePath)
			}
		})
		return {
			files: filterIndex.length
				? fileList.filter((item, index) => filterIndex.indexOf(index) === -1)
				: fileList,
			filesPath
		}
	} catch (err) {
		return undefined
	}
}
