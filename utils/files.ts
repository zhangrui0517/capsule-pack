import fs from 'fs'
import path from 'path'
/** 从package.json 中获取相关信息 */
export function getPackageJson () {
  const packageJson = fs.readFileSync(path.resolve(process.cwd(),'./package.json'))
  if(packageJson) {
    try {
      const packageJsonStr = packageJson.toString()
      return JSON.parse(packageJsonStr)
    } catch (err) {
      console.error(err)
    }
  }
  return null
}