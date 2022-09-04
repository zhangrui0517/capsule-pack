"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.outputDirPath = exports.cacheDirPath = exports.contextPath = void 0;
var path_1 = __importDefault(require("path"));
var child_process_1 = __importDefault(require("child_process"));
exports.contextPath = path_1["default"].resolve(child_process_1["default"].execSync('npm root').toString(), '../');
exports.cacheDirPath = path_1["default"].resolve(exports.contextPath, './node_modules/.cache/');
exports.outputDirPath = path_1["default"].resolve(exports.contextPath, './dist');
