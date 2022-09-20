import fs from 'fs-extra'
import path from 'path'
import child_process from 'child_process'
import { packageJson, cTemplatePath, projectPath } from '../utils/path'
/** type */
import { templateType } from '../types'
import type { Stats } from 'fs-extra'

const packageByTemplate: Record<
  templateType | 'common',
  {
    scripts?: Record<string, string>
    devDependencies?: string
    dependencies?: string
  }
> = {
  common: {
    scripts: {
      'dev': 'npx cpack dev',
      'dev-server': 'npx cpack dev-server',
      'build': 'npx cpack build'
    }
  },
  react: {
    dependencies: 'react react-dom',
    devDependencies: 'capsule-pack @types/react @types/react-dom'
  },
  tools: {},
  components: {}
}

/** 处理package.json文件（添加依赖、脚本等），如果不存在则创建 */
export function packageJsonGenerator(type: templateType, callback?: (stat: Stats) => void) {
  /** 是否存在packageJson */
  fs.stat(packageJson, (err: NodeJS.ErrnoException, stat: Stats) => {
    if (err) {
      console.log('初始化package.json文件')
      child_process.execSync('npm init -y')
    }
    console.log('往package.json注入执行脚本和相关依赖信息')
    const editJson = fs.readJsonSync(packageJson)
    editJson.scripts = editJson.scripts || {}
    Object.assign(editJson.scripts, packageByTemplate['common'].scripts)
    editJson &&
      fs.writeJSONSync(packageJson, editJson, {
        spaces: '\t'
      })
    const currentDepPackage = packageByTemplate[type].dependencies
    currentDepPackage && child_process.execSync(`npm i ${currentDepPackage} -save`)
    const currentDevPackage = packageByTemplate[type].devDependencies
    currentDevPackage && child_process.execSync(`npm i ${currentDevPackage} -save-dev`)
    console.log('package.json创建完成')
    callback && callback(stat)
  })
}

export function copyCpackTemplate(type: templateType, callback: () => void) {
  fs.copy(path.resolve(cTemplatePath, type), projectPath, (err: NodeJS.ErrnoException) => {
    if (err) {
      console.error(err)
      return
    }
    callback && callback()
  })
}
