"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs-extra');
const path = require('path');
const child_process = require('child_process');
const { packageJson, cTemplatePath, projectPath } = require('./path');
const packageByTemplate = {
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
};
function packageJsonGenerator(type, callback) {
    fs.stat(packageJson, (err, stat) => {
        if (err) {
            console.log('初始化package.json文件');
            child_process.execSync('npm init -y');
        }
        console.log('往package.json注入执行脚本和相关依赖信息');
        const editJson = fs.readJsonSync(packageJson);
        editJson.scripts = editJson.scripts || {};
        Object.assign(editJson.scripts, packageByTemplate['common'].scripts);
        editJson &&
            fs.writeJSONSync(packageJson, editJson, {
                spaces: '\t'
            });
        const currentDepPackage = packageByTemplate[type].dependencies;
        currentDepPackage && child_process.execSync(`npm i ${currentDepPackage} -save`);
        const currentDevPackage = packageByTemplate[type].devDependencies;
        currentDevPackage && child_process.execSync(`npm i ${currentDevPackage} -save-dev`);
        console.log('package.json创建完成');
        callback && callback(stat);
    });
}
function copyCpackTemplate(type, callback) {
    fs.copy(path.resolve(cTemplatePath, type), projectPath, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        callback && callback();
    });
}
module.exports = {
    packageJsonGenerator,
    copyCpackTemplate
};
