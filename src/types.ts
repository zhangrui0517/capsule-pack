import { Question } from 'inquirer'
import Module from 'module'

export type TemplateConfig = {
	npmName?: string
	inquirer?: Question[]
}

export interface NodeModuleWithCompile extends NodeModule {
	_compile(code: string, filename: string): any
}

export type ModuleWithExtensions = typeof Module & {
	_extensions: Record<string, (module: NodeModuleWithCompile, filename: string) => void>
}
