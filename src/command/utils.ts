import fs from 'fs-extra'
import path from 'path'
import child_process from 'child_process'
import { getPackageJson, getCtemplatePath, projectPath } from '../utils/path'
/** type */
import type { templateType, projectInquirerAnswers } from '../types'

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
      'dev': 'npx cpack dev',
      'dev-server': 'npx cpack dev-server',
      'build': 'npx cpack build'
    },
    dependencies: [],
    devDependencies: ['husky','prettier','typescript','@typescript-eslint/eslint-plugin','@typescript-eslint/parser','eslint-config-prettier', 'eslint']
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

/** 处理package.json文件（添加依赖、脚本等），如果不存在则创建 */
export function packageJsonGenerator(config: projectInquirerAnswers, callback?: () => void) {
  const { type, packageManager } = config
  const packageJson = getPackageJson()
  const isPackageJsonExists = fs.existsSync(packageJson)
  /** 是否存在packageJson */
  if(!isPackageJsonExists) {
    console.info('初始化package.json文件')
    child_process.spawnSync(packageManager,['init', '-y'], {
      shell: true
    })
  }
  console.info('往package.json注入执行脚本和相关依赖信息')
  const commonPackageTemplate = packageByTemplate['common']
  const editJson = fs.readJsonSync(packageJson)
  editJson.scripts = editJson.scripts || {}
  Object.assign(editJson.scripts, commonPackageTemplate.scripts)
  editJson &&
    fs.writeJSONSync(packageJson, editJson, {
      spaces: '\t'
    })
  console.info('开始安装预置依赖')
  removePackageLock(packageManager)
  const currentDepPackage = [...commonPackageTemplate.dependencies, ...packageByTemplate[type].dependencies]
  const depSpawn = currentDepPackage && child_process.spawnSync(packageManager,['add', ...currentDepPackage, '-S'], {
    shell: true
  })
  console.info(depSpawn?.stdout.toString())
  removePackageLock(packageManager)
  const currentDevPackage = [...commonPackageTemplate.devDependencies, ...packageByTemplate[type].devDependencies]
  const devSpawn = currentDevPackage && child_process.spawnSync(packageManager,['add', ...currentDevPackage, '-D'], {
    shell: true
  })
  console.info(devSpawn?.stdout.toString())
  console.info('package.json创建完成')
  callback && callback()
}

export function copyCpackTemplate(type: templateType, callback: () => void) {
  fs.copy(path.resolve(getCtemplatePath(), type), projectPath, (err: NodeJS.ErrnoException) => {
    if (err) {
      console.error(err)
      return
    }
    callback && callback()
  })
}

/** 删除目录下的包锁定文件 */
export function removePackageLock (packageManager: projectInquirerAnswers['packageManager']) {
  const lockFile = {
    'npm': 'package-lock.json',
    'yarn': 'yarn.lock'
  }
  const packageLock = path.resolve(projectPath,`./${lockFile[packageManager]}`)
  if(fs.existsSync(packageLock)) {
    fs.unlinkSync(packageLock)
  }
}
