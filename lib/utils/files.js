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
    var packageJson = fs_1["default"].readFileSync(path_1["default"].resolve(process.cwd(), './package.json'));
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
    var _a, _b;
    var tsConfigPath = path_1["default"].resolve(_1.contextPath, './lib/webpack.custom.js');
    var hasTsConfig = fs_1["default"].existsSync(tsConfigPath);
    if (hasTsConfig) {
        return ((_a = importJs(tsConfigPath)) === null || _a === void 0 ? void 0 : _a["default"]) || null;
    }
    var jsConfigPath = path_1["default"].resolve(_1.contextPath, 'webpack.custom.js');
    var hasJsConfig = fs_1["default"].existsSync(jsConfigPath);
    if (hasJsConfig) {
        return ((_b = importJs(jsConfigPath)) === null || _b === void 0 ? void 0 : _b["default"]) || null;
    }
    return null;
}
exports.getCustomWebpack = getCustomWebpack;
