"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var webpack_1 = __importDefault(require("webpack"));
var webpack_dev_server_1 = __importDefault(require("webpack-dev-server"));
var webpack_dev_1 = __importDefault(require("../config/webpack.dev"));
var webpack_prod_1 = __importDefault(require("../config/webpack.prod"));
function webpackCommand(program) {
    program
        .command('dev')
        .description('构建开发环境产物')
        .action(function () {
        (0, webpack_1["default"])((0, webpack_dev_1["default"])(), function (err, stats) {
            if (stats) {
                if (err || stats.hasErrors()) {
                    var error = err || stats.hasErrors();
                    console.error(error);
                }
                console.log(stats.toString());
            }
        });
    });
    program
        .command('dev-server')
        .description('构建开发环境产物，并启动本地服务')
        .action(function () {
        var webpackConfig = (0, webpack_dev_1["default"])();
        var compiler = (0, webpack_1["default"])(webpackConfig);
        var devServerOptions = __assign({}, webpackConfig.devServer);
        var server = new webpack_dev_server_1["default"](devServerOptions, compiler);
        server.start();
        server.startCallback(function () {
            console.log('Successfully started');
        });
        server.stopCallback(function () {
            console.log('Successfully stop');
        });
    });
    program
        .command('build')
        .description('构建生产环境产物')
        .action(function () {
        (0, webpack_1["default"])((0, webpack_prod_1["default"])(), function (err, stats) {
            if (stats) {
                if (err || stats.hasErrors()) {
                    var error = err || stats.hasErrors();
                    console.error(error);
                }
                console.log(stats.toString());
            }
        });
    });
}
exports["default"] = webpackCommand;
