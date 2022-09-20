"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = __importDefault(require("webpack"));
const webpack_dev_server_1 = __importDefault(require("webpack-dev-server"));
const webpack_dev_1 = __importDefault(require("../config/webpack.dev"));
const webpack_prod_1 = __importDefault(require("../config/webpack.prod"));
function webpackCommand(program) {
    program
        .command('dev')
        .description('构建开发环境产物')
        .action(() => {
        (0, webpack_1.default)((0, webpack_dev_1.default)(), (err, stats) => {
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
        const webpackConfig = (0, webpack_dev_1.default)();
        const compiler = (0, webpack_1.default)(webpackConfig);
        const devServerOptions = Object.assign({}, webpackConfig.devServer);
        const server = new webpack_dev_server_1.default(devServerOptions, compiler);
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
        (0, webpack_1.default)((0, webpack_prod_1.default)(), (err, stats) => {
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
exports.default = webpackCommand;
