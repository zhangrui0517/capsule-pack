"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomWebpack = void 0;
const fs = require('fs');
const path = require('path');
const { projectPath } = require('.');
function getPackageJson() {
    const packageJson = fs.readFileSync(path.resolve(projectPath, './package.json'));
    if (packageJson) {
        try {
            const packageJsonStr = packageJson.toString();
            return JSON.parse(packageJsonStr);
        }
        catch (err) {
            console.error(err);
        }
    }
    return null;
}
function importJs(path) {
    try {
        const module = require(path);
        return module;
    }
    catch (err) {
        console.error(err);
        return null;
    }
}
function getCustomWebpack() {
    const jsConfigPath = path.resolve(projectPath, './webpack.custom.js');
    if (fs.existsSync(jsConfigPath)) {
        return importJs(jsConfigPath) || null;
    }
    return null;
}
exports.getCustomWebpack = getCustomWebpack;
module.exports = {
    getPackageJson,
    importJs
};
