"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCtemplatePath = exports.getCpackPath = exports.getCurrentTemplatePath = exports.getPackageJson = exports.getOutputDirPath = exports.getCacheDirPath = exports.packagePath = exports.projectPath = void 0;
const path_1 = __importDefault(require("path"));
exports.projectPath = process.cwd();
exports.packagePath = path_1.default.resolve(__dirname.split('capsule-pack')[0], './capsule-pack');
function getCacheDirPath() {
    return path_1.default.resolve(exports.projectPath, './node_modules/.cache/');
}
exports.getCacheDirPath = getCacheDirPath;
function getOutputDirPath() {
    return path_1.default.resolve(exports.projectPath, './dist');
}
exports.getOutputDirPath = getOutputDirPath;
function getPackageJson() {
    return path_1.default.resolve(exports.projectPath, './package.json');
}
exports.getPackageJson = getPackageJson;
function getCurrentTemplatePath() {
    return path_1.default.resolve(exports.projectPath, './template');
}
exports.getCurrentTemplatePath = getCurrentTemplatePath;
function getCpackPath() {
    return path_1.default.resolve(exports.packagePath, './lib');
}
exports.getCpackPath = getCpackPath;
function getCtemplatePath() {
    return path_1.default.resolve(exports.packagePath, './template');
}
exports.getCtemplatePath = getCtemplatePath;
