"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("../utils/path");
const utils_1 = require("./utils");
function templateCommand(program) {
    program
        .command('create')
        .argument('[type]')
        .description('用于快速创建开发环境，提供开发构建脚手架')
        .action(type => {
        const dirList = fs_extra_1.default.readdirSync((0, path_1.getCtemplatePath)());
        if (dirList.indexOf(type) > -1) {
            console.log(`开始创建${type}模板`);
            (0, utils_1.copyCpackTemplate)(type, () => {
                console.log('模板创建成功');
                (0, utils_1.packageJsonGenerator)(type);
            });
        }
        else {
            const inquirer = require('inquirer');
            inquirer
                .prompt([
                {
                    type: 'list',
                    name: 'type',
                    message: '请选择模板',
                    choices: dirList
                }
            ])
                .then((answers) => {
                const { type } = answers;
                console.log(`开始创建${type}模板`);
                (0, utils_1.copyCpackTemplate)(type, () => {
                    console.log('模板创建成功');
                    (0, utils_1.packageJsonGenerator)(type);
                });
            });
        }
        console.log('项目创建完成');
    });
    program
        .command('new')
        .description('用于创建用户自定义的模板，可直接传入一个路径或模板名称，如果传入模板名称，会到package.json所在的位置寻找template文件夹')
        .argument('<file>')
        .action(async (file) => {
        const filePath = `${(0, path_1.getCurrentTemplatePath)()}/${file}`;
        try {
            const stat = await fs_extra_1.default.stat(filePath);
            if (stat) {
                fs_extra_1.default.copy(filePath, `${path_1.projectPath}/${file}`);
            }
        }
        catch (err) {
            throw new Error(err);
        }
    });
}
exports.default = templateCommand;
