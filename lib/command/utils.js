"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyCpackTemplate = exports.packageJsonGenerator = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const child_process_1 = __importDefault(require("child_process"));
const path_2 = require("../utils/path");
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
    fs_extra_1.default.stat(path_2.packageJson, (err, stat) => {
        if (err) {
            console.log('初始化package.json文件');
            child_process_1.default.execSync('npm init -y');
        }
        console.log('往package.json注入执行脚本和相关依赖信息');
        const editJson = fs_extra_1.default.readJsonSync(path_2.packageJson);
        editJson.scripts = editJson.scripts || {};
        Object.assign(editJson.scripts, packageByTemplate['common'].scripts);
        editJson &&
            fs_extra_1.default.writeJSONSync(path_2.packageJson, editJson, {
                spaces: '\t'
            });
        const currentDepPackage = packageByTemplate[type].dependencies;
        currentDepPackage && child_process_1.default.execSync(`npm i ${currentDepPackage} -save`);
        const currentDevPackage = packageByTemplate[type].devDependencies;
        currentDevPackage && child_process_1.default.execSync(`npm i ${currentDevPackage} -save-dev`);
        console.log('package.json创建完成');
        callback && callback(stat);
    });
}
exports.packageJsonGenerator = packageJsonGenerator;
function copyCpackTemplate(type, callback) {
    fs_extra_1.default.copy(path_1.default.resolve(path_2.cTemplatePath, type), path_2.projectPath, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        callback && callback();
    });
}
exports.copyCpackTemplate = copyCpackTemplate;
