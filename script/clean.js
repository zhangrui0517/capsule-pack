/** 用于tsc编译前，清除旧的编译产物 */
const fs = require('fs')
const path = require('path')
const libPath = path.resolve(__dirname, '../lib')
fs.rmdirSync(libPath, {
  recursive: true
})