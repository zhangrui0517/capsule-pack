import fs from 'fs-extra'
import path from 'path'
/** util */
import { Listr } from 'listr2'
import execa from 'execa'
import { getPackageJson, getCtemplatePath, projectPath } from '../utils/path'
/** type */
import type { templateType, projectInquirerAnswers } from '../types'

/** 包预设 */
const packageByTemplate: Record<
  templateType | 'common',
  {
    scripts?: Record<string, string>
    devDependencies: string[]
    dependencies: string[]
  }
> = {
  common: {
    scripts: {
      dev: 'npx cpack dev',
      'dev-server': 'npx cpack dev-server',
      build: 'npx cpack build'
    },
    dependencies: [],
    devDependencies: ['husky', 'prettier', 'typescript', '@typescript-eslint/eslint-plugin', '@typescript-eslint/parser', 'eslint-config-prettier', 'eslint']
  },
  react: {
    dependencies: ['react', 'react-dom'],
    devDependencies: ['@types/react', '@types/react-dom', 'eslint-plugin-react']
  },
  tools: {
    dependencies: [],
    devDependencies: []
  },
  components: {
    dependencies: [],
    devDependencies: []
  }
}

/** 包管理器对应的安装命令 */
const packManagerCommand = {
  yarn: 'add',
  npm: 'install'
}

/** 处理package.json文件（添加依赖、脚本等），如果不存在则创建 */
export function packageJsonGenerator(config: projectInquirerAnswers) {
  const { type, packageManager } = config
  const packageJson = getPackageJson()
  const isPackageJsonExists = fs.existsSync(packageJson)
  const commonPackageTemplate = packageByTemplate['common']
  return new Listr([
    {
      title: '初始化package.json文件',
      skip: () => {
        /** 是否存在packageJson */
        if (isPackageJsonExists) {
          return '已存在package.json文件'
        }
        return false
      },
      task: () => {
        return execa(packageManager, ['init', '-y'])
      }
    },
    {
      title: '往package.json注入执行脚本和相关依赖信息',
      task: () => {
        const editJson = fs.readJsonSync(packageJson)
        editJson.scripts = editJson.scripts || {}
        Object.assign(editJson.scripts, commonPackageTemplate.scripts)
        editJson &&
          fs.writeJSONSync(packageJson, editJson, {
            spaces: '\t'
          })
        return '脚本信息注入完成'
      }
    },
    {
      title: '开始安装预置依赖',
      task: () => {
        removePackageLock(packageManager)
        const currentDepPackage = [...commonPackageTemplate.dependencies, ...packageByTemplate[type].dependencies]
        const currentDevPackage = [...commonPackageTemplate.devDependencies, ...packageByTemplate[type].devDependencies]
        return Promise.all([
          execa(packageManager, [packManagerCommand[packageManager], ...currentDepPackage, '-S']),
          execa(packageManager, [packManagerCommand[packageManager], ...currentDevPackage, '-D'])
        ])
      }
    }
  ])
}

export function copyCpackTemplate(type: templateType) {
  return new Listr([
    {
      title: '模板创建中',
      task: () => {
        fs.copySync(path.resolve(getCtemplatePath(), type), projectPath)
        return ''
      }
    }
  ])
}

/** 删除目录下的包锁定文件 */
export function removePackageLock(packageManager: projectInquirerAnswers['packageManager']) {
  const lockFile = {
    npm: 'package-lock.json',
    yarn: 'yarn.lock'
  }
  const packageLock = path.resolve(projectPath, `./${lockFile[packageManager]}`)
  if (fs.existsSync(packageLock)) {
    fs.unlinkSync(packageLock)
  }
}
