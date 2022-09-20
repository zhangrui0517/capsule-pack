"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cTemplatePath = exports.cPackPath = exports.currentTemplatePath = exports.packageJson = exports.packagePath = exports.outputDirPath = exports.cacheDirPath = exports.projectPath = void 0;
const path_1 = __importDefault(require("path"));
exports.projectPath = process.cwd();
exports.cacheDirPath = path_1.default.resolve(exports.projectPath, './node_modules/.cache/');
exports.outputDirPath = path_1.default.resolve(exports.projectPath, './dist');
exports.packagePath = path_1.default.resolve(__dirname.split('capsule-pack')[0], './capsule-pack');
exports.packageJson = path_1.default.resolve(exports.projectPath, './package.json');
exports.currentTemplatePath = path_1.default.resolve(exports.projectPath, './template');
exports.cPackPath = path_1.default.resolve(exports.packagePath, './lib');
exports.cTemplatePath = path_1.default.resolve(exports.packagePath, './template');
