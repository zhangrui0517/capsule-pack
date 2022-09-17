"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.cTemplatePath = exports.cPackPath = exports.currentTemplatePath = exports.packageJson = exports.projectPath = exports.packagePath = void 0;
var child_process_1 = __importDefault(require("child_process"));
var path_1 = __importDefault(require("path"));
exports.packagePath = path_1["default"].resolve(__dirname.split('capsule-pack')[0], './capsule-pack');
exports.projectPath = path_1["default"].resolve(child_process_1["default"].execSync('npm root').toString(), '../');
exports.packageJson = path_1["default"].resolve(exports.projectPath, './package.json');
exports.currentTemplatePath = path_1["default"].resolve(exports.projectPath, './template');
exports.cPackPath = path_1["default"].resolve(exports.packagePath, './lib');
exports.cTemplatePath = path_1["default"].resolve(exports.cPackPath, './template');
