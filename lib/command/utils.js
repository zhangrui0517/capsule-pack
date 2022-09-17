"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.copyCpackTemplate = exports.packageJsonGenerator = void 0;
var fs_extra_1 = __importDefault(require("fs-extra"));
var path_1 = __importDefault(require("path"));
var child_process_1 = __importDefault(require("child_process"));
var path_2 = require("./path");
var packageByTemplate = {
    'common': {
        scripts: {
            'dev': 'npx cpack dev',
            'dev-server': 'npx cpack dev-server',
            'build': 'npx cpack build'
        }
    },
    'react': {
        dependencies: 'react react-dom',
        devDependencies: '@types/react @types/react-dom'
    },
    'tools': {},
    'components': {}
};
function packageJsonGenerator(type, callback) {
    fs_extra_1["default"].stat(path_2.packageJson, function (err, stat) {
        if (err) {
            child_process_1["default"].execSync('npm init -y');
        }
        var editJson = fs_extra_1["default"].readJsonSync(path_2.packageJson);
        editJson.scripts = editJson.scripts || {};
        Object.assign(editJson.scripts, packageByTemplate['common'].scripts);
        editJson && fs_extra_1["default"].writeJSONSync(path_2.packageJson, editJson, {
            spaces: '\t'
        });
        var currentDepPackage = packageByTemplate[type].dependencies;
        currentDepPackage && child_process_1["default"].execSync("npm i ".concat(currentDepPackage, " -S"));
        var currentDevPackage = packageByTemplate[type].devDependencies;
        currentDevPackage && child_process_1["default"].execSync("npm i ".concat(currentDevPackage, " -D"));
        callback && callback(stat);
    });
}
exports.packageJsonGenerator = packageJsonGenerator;
function copyCpackTemplate(type, callback) {
    fs_extra_1["default"].copy(path_1["default"].resolve(path_2.cTemplatePath, type), path_2.projectPath, function (err) {
        if (err) {
            console.error(err);
            return;
        }
        callback && callback();
    });
}
exports.copyCpackTemplate = copyCpackTemplate;
