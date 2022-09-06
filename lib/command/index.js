"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var commander_1 = require("commander");
var webpackCommand_1 = __importDefault(require("./webpackCommand"));
var templateCommand_1 = __importDefault(require("./templateCommand"));
function runCpack() {
    var program = new commander_1.Command();
    program
        .name('cpack')
        .description('用于生成项目模板、组件模板、辅助工具')
        .helpOption('-h', '查看帮助信息')
        .addHelpCommand(false);
    (0, templateCommand_1["default"])(program);
    (0, webpackCommand_1["default"])(program);
    program.parse();
}
exports["default"] = runCpack;