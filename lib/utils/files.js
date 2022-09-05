"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.getCustomWebpack = exports.importJs = exports.getPackageJson = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var _1 = require(".");
function getPackageJson() {
    var packageJson = fs_1["default"].readFileSync(path_1["default"].resolve(_1.rootPath, './package.json'));
    if (packageJson) {
        try {
            var packageJsonStr = packageJson.toString();
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
        var module_1 = require(path);
        return module_1;
    }
    catch (err) {
        console.error(err);
        return null;
    }
}
exports.importJs = importJs;
function getCustomWebpack() {
    var jsConfigPath = path_1["default"].resolve(_1.rootPath, './webpack.custom.js');
    if (fs_1["default"].existsSync(jsConfigPath)) {
        return importJs(jsConfigPath) || null;
    }
    return null;
}
exports.getCustomWebpack = getCustomWebpack;
