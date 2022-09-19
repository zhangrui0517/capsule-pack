"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const devConfig = require('../config/webpack.dev');
const prodConfig = require('../config/webpack.prod');
function webpackCommand(program) {
    program
        .command('dev')
        .description('构建开发环境产物')
        .action(() => {
        Webpack(devConfig(), (err, stats) => {
            if (stats) {
                if (err || stats.hasErrors()) {
                    const error = err || stats.hasErrors();
                    console.error(error);
                }
                console.log(stats.toString());
            }
        });
    });
    program
        .command('dev-server')
        .description('构建开发环境产物，并启动本地服务')
        .action(() => {
        const webpackConfig = devConfig();
        const compiler = Webpack(webpackConfig);
        const devServerOptions = Object.assign({}, webpackConfig.devServer);
        const server = new WebpackDevServer(devServerOptions, compiler);
        server.start();
        server.startCallback(() => {
            console.log('Successfully started');
        });
        server.stopCallback(() => {
            console.log('Successfully stop');
        });
    });
    program
        .command('build')
        .description('构建生产环境产物')
        .action(() => {
        Webpack(prodConfig(), (err, stats) => {
            if (stats) {
                if (err || stats.hasErrors()) {
                    const error = err || stats.hasErrors();
                    console.error(error);
                }
                console.log(stats.toString());
            }
        });
    });
}
module.exports = webpackCommand;
