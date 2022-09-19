"use strict";
const path = require('path');
const child_process = require('child_process');
const projectPath = path.resolve(child_process.execSync('npm root').toString(), '../');
const cacheDirPath = path.resolve(projectPath, './node_modules/.cache/');
const outputDirPath = path.resolve(projectPath, './dist');
module.exports = {
    projectPath,
    cacheDirPath,
    outputDirPath
};
