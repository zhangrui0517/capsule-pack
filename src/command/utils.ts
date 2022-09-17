import fs, { Stats } from 'fs-extra'
import path from 'path'
import child_process from 'child_process'
import { packageJson, cTemplatePath, projectPath } from './path'
import { templateType } from '../types'

const packageByTemplate: Record<templateType | 'common', {
  scripts?: Record<string, string>
  devDependencies?: string
  dependencies?: string
}> = {
  'common': {
    scripts: {
      'dev': 'npx cpack dev',
      'dev-server': 'npx cpack dev-server',
      'build': 'npx cpack build'
    }
  },
  'react': {
    dependencies: 'react react-dom',
    devDependencies: 'capsule-pack @types/react @types/react-dom'
  },
  'tools': {},
  'components': {}
}

/** 处理package.json文件（添加依赖、脚本等），如果不存在则创建 */
export function packageJsonGenerator (type: templateType,callback?: (stat: Stats) => void) {
  /** 是否存在packageJson */
  fs.stat(packageJson, (err, stat) => {
    if(err) {
      child_process.execSync('npm init -y')
    }
    const editJson = fs.readJsonSync(packageJson)
    editJson.scripts = editJson.scripts || {}
    Object.assign(editJson.scripts, packageByTemplate['common'].scripts)
    editJson && fs.writeJSONSync(packageJson, editJson, {
      spaces: '\t'
    })
    const currentDepPackage = packageByTemplate[type].dependencies
    currentDepPackage && child_process.execSync(`npm i ${currentDepPackage} -S`)
    const currentDevPackage = packageByTemplate[type].devDependencies
    currentDevPackage && child_process.execSync(`npm i ${currentDevPackage} -D`)
    callback && callback(stat)
  })
}

export function copyCpackTemplate (type: templateType, callback: () => void) {
  fs.copy(path.resolve(cTemplatePath, type), projectPath, (err) => {
    if(err) {
      console.error(err)
      return
    }
    callback && callback()
  })
}