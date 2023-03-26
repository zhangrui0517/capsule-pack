import axios from 'axios'
import { URL } from 'url'
import { execa } from 'execa'
import { NPM_MIRROR_REGISTRY } from './index.js'

export function getNpmInfo(npmName: string) {
	const urlObject = new URL(npmName, NPM_MIRROR_REGISTRY)
	return axios.get(urlObject.toString())
}

export function switchRegistry(registry: string) {
	const command = 'npm'
	const args = ['config', 'set', 'registry', registry]
	return execa(command, args)
}
