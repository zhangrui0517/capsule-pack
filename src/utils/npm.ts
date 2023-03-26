import axios from 'axios'
import { URL } from 'url'
import { NPM_MIRROR_REGISTRY } from './index.js'

export function getNpmInfo(npmName: string) {
	const urlObject = new URL(npmName, NPM_MIRROR_REGISTRY)
	return axios.get(urlObject.toString())
}
