"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs-extra');
const inquirer = require('inquirer');
const { cTemplatePath, currentTemplatePath, projectPath } = require('./path');
const { packageJsonGenerator, copyCpackTemplate } = require('./utils');
function templateCommand(program) {
    program
        .command('create')
        .argument('[type]')
        .description('用于快速创建开发环境，提供开发构建脚手架')
        .action(type => {
        const dirList = fs.readdirSync(cTemplatePath);
        if (dirList.indexOf(type) > -1) {
            console.log(`开始创建${type}模板`);
            copyCpackTemplate(type, () => {
                console.log('模板创建成功');
                packageJsonGenerator(type);
            });
        }
        else {
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
                copyCpackTemplate(type, () => {
                    console.log('模板创建成功');
                    packageJsonGenerator(type);
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
        const filePath = `${currentTemplatePath}/${file}`;
        try {
            const stat = await fs.stat(filePath);
            if (stat) {
                fs.copy(filePath, `${projectPath}/${file}`);
            }
        }
        catch (err) {
            throw new Error(err);
        }
    });
}
module.exports = templateCommand;
