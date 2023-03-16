import path, { dirname as pathDirname } from 'path'
import { fileURLToPath } from 'url'
import fse from 'fs-extra'
import { PACKAGE_NAME } from './index.js'

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
  const packageRoot = path.resolve(
    currentDir.split(PACKAGE_NAME)[0]!,
    filename ? `./${PACKAGE_NAME}/${filename}` : `./${PACKAGE_NAME}`
  )
  return packageRoot
}

export function getDirFiles(findName: string, dirname?: string) {
  const currentDirPath = path.resolve(dirname || process.cwd(), `./${findName}`)
  try {
    const result = fse.readdirSync(currentDirPath)
    return result
  } catch (err) {
    return undefined
  }
}
