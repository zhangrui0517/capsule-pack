"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process = require('child_process');
const path = require('path');
const packagePath = path.resolve(__dirname.split('capsule-pack')[0], './capsule-pack');
const projectPath = path.resolve(child_process.execSync('npm root').toString(), '../');
const packageJson = path.resolve(projectPath, './package.json');
const currentTemplatePath = path.resolve(projectPath, './template');
const cPackPath = path.resolve(packagePath, './lib');
const cTemplatePath = path.resolve(packagePath, './template');
module.exports = {
    packagePath,
    projectPath,
    packageJson,
    currentTemplatePath,
    cPackPath,
    cTemplatePath
};
