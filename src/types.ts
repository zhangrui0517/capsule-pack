import { Question } from 'inquirer'
import Module from 'module'

export type TemplateConfig = {
	/** 要下载npm包名称 */
	npmName?: string
	/** 需要交互的问题 */
	inquirer?: Question[]
	/** 创建模板完成后要执行的脚本 */
	postScripts?: string[]
}

export interface NodeModuleWithCompile extends NodeModule {
	_compile(code: string, filename: string): any
}

export type ModuleWithExtensions = typeof Module & {
	_extensions: Record<
		string,
		(module: NodeModuleWithCompile, filename: string) => void
	>
}
