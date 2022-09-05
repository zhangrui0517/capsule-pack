/** 用于tsc编译前，清除旧的编译产物 */
const fs = require('fs')
const path = require('path')
const child_process = require('child_process')
const libPath = path.resolve(child_process.execSync('npm root').toString(), '../lib')
fs.rmdirSync(libPath, {
  recursive: true
})