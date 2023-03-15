import path, { dirname as pathDirname } from 'path'
import { fileURLToPath } from 'url'
import fse from 'fs-extra'
import { PACKAGE_NAME } from './constant.js'

export function filename(importMeta: Record<string, any>) {
  return fileURLToPath(importMeta.url)
}

export function dirname(importMeta: Record<string, any>) {
  return pathDirname(filename(importMeta))
}

export function getPkg() {
  const currentDir = dirname(import.meta)
  const packageRoot = path.resolve(
    currentDir.split(PACKAGE_NAME)[0]!,
    './capsule-pack/package.json'
  )
  const packageJson = fse.readJSONSync(packageRoot, { throws: false })
  if (!packageJson) {
    console.error(
      'package.json not found. Please find it in the directory where package.json exists'
    )
  }
  return packageJson
}
