"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const inquirer_1 = __importDefault(require("inquirer"));
const path_2 = require("../utils/path");
const utils_1 = require("./utils");
function templateCommand(program) {
    program
        .command('create')
        .description('用于快速创建开发环境，提供开发构建脚手架')
        .action(() => {
        const dirList = fs_extra_1.default.readdirSync((0, path_2.getCtemplatePath)());
        inquirer_1.default
            .prompt([
            {
                type: 'list',
                name: 'type',
                message: '请选择模板',
                choices: dirList
            },
            {
                type: 'list',
                name: 'packageManager',
                message: '使用的包管理器',
                choices: ['npm', 'yarn']
            }
        ])
            .then((answers) => {
            const { type, packageManager } = answers;
            console.info(`开始创建${type}模板`);
            (0, utils_1.packageJsonGenerator)({ type, packageManager }, () => {
                (0, utils_1.copyCpackTemplate)(type, () => {
                    console.info('模板创建成功');
                });
            });
        });
    });
    program
        .command('new')
        .description('用于创建用户自定义的模板，可直接传入一个路径或模板名称，如果传入模板名称，会到package.json所在的位置寻找template文件夹')
        .argument('[file]')
        .action(() => {
        const templatePath = (0, path_2.getCurrentTemplatePath)();
        if (fs_extra_1.default.existsSync(templatePath)) {
            const dirList = fs_extra_1.default.readdirSync(templatePath);
            inquirer_1.default
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
                fs_extra_1.default.copySync(path_1.default.resolve(templatePath, type), path_1.default.resolve(path_2.projectPath, type));
                console.info('模板创建成功');
            });
        }
        else {
            throw new Error('没找到template目录，请确认目录下是否存在template文件夹');
        }
    });
}
exports.default = templateCommand;
