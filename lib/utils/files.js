"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomWebpack = exports.importJs = exports.getPackageJson = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const path_2 = require("./path");
function getPackageJson() {
    const packageJson = fs_1.default.readFileSync(path_1.default.resolve(path_2.projectPath, './package.json'));
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
exports.getPackageJson = getPackageJson;
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
exports.importJs = importJs;
function getCustomWebpack() {
    const jsConfigPath = path_1.default.resolve(path_2.projectPath, './webpack.custom.js');
    if (fs_1.default.existsSync(jsConfigPath)) {
        return importJs(jsConfigPath) || null;
    }
    return null;
}
exports.getCustomWebpack = getCustomWebpack;
