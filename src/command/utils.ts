import fs from 'fs-extra'
import path from 'path'
import child_process from 'child_process'
import { getPackageJson, getCtemplatePath, projectPath } from '../utils/path'
/** type */
import { templateType } from '../types'
import type { Stats } from 'fs-extra'

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
export function packageJsonGenerator(type: templateType, callback?: (stat: Stats) => void) {
  const packageJson = getPackageJson()
  /** 是否存在packageJson */
  fs.stat(packageJson, (err: NodeJS.ErrnoException, stat: Stats) => {
    if (err) {
      console.info('初始化package.json文件')
      const packageSpawn = child_process.spawnSync('npm',['init', '-y'], {
        shell: true
      })
      console.error(packageSpawn.output.toString())
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
    removePackageLock()
    const currentDepPackage = [...commonPackageTemplate.dependencies, ...packageByTemplate[type].dependencies]
    const depSpawn = currentDepPackage && child_process.spawnSync('npm',['install', ...currentDepPackage, '-save'], {
      shell: true
    })
    console.info(depSpawn?.stdout.toString())
    removePackageLock()
    const currentDevPackage = [...commonPackageTemplate.devDependencies, ...packageByTemplate[type].devDependencies]
    const devSpawn = currentDevPackage && child_process.spawnSync('npm',['install', ...currentDevPackage, '--save-dev'], {
      shell: true
    })
    console.info(devSpawn?.stdout.toString())
    console.info('package.json创建完成')
    callback && callback(stat)
  })
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

export function removePackageLock () {
  const packageLock = path.resolve(projectPath,'./package-lock.json')
  if(fs.existsSync(packageLock)) {
    fs.unlinkSync(packageLock)
  }
}
