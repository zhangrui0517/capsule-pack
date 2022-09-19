"use strict";
const { Command } = require('commander');
const webpackCommand = require('./webpackCommand');
const templateCommand = require('./templateCommand');
function runCpack() {
    const program = new Command();
    program.name('cpack').description('用于生成项目模板、组件模板、辅助工具').helpOption('-h', '查看帮助信息').addHelpCommand(false);
    templateCommand(program);
    webpackCommand(program);
    program.parse();
}
module.exports = runCpack;
