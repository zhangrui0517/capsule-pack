import { resolve } from 'path'
import { homedir } from 'os'

export function getTemplateCacheDir(path?: string[]) {
	return path ? resolve(homedir(), '.capsule', 'templates', ...path) : resolve(homedir(), '.capsule', 'templates')
}
