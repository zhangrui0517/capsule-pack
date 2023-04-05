import { transformSync } from 'esbuild'
import fse from 'fs-extra'
const { readFileSync } = fse

export function detectModuleType(
	file: string,
	options: {
		isCode?: boolean
	} = {}
) {
	const { isCode } = options
	const content = isCode ? file : readFileSync(file, 'utf8')

	// 检查是否使用了CommonJS语法
	if (/\bmodule\.exports\b/.test(content) || /\brequire\(/.test(content)) {
		return 'commonjs'
	}

	// 检查是否使用了ES模块语法
	if (/\bimport\b/.test(content) || /\bexport\b/.test(content)) {
		return 'esm'
	}

	// 默认情况下返回Unknown
	return 'unknown'
}

export async function transformCommonJsToESM(fileData: string) {
	return transformSync(fileData, {
		format: 'esm',
		loader: 'js'
	})
}

export async function transformESMToCommonJs(fileData: string) {
	return transformSync(fileData, {
		format: 'cjs',
		loader: 'js'
	})
}
