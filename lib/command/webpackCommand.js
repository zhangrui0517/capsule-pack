"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var webpack_1 = __importDefault(require("webpack"));
var webpack_dev_1 = __importDefault(require("../config/webpack.dev"));
function webpackCommand(program) {
    program
        .command('dev')
        .action(function () {
        (0, webpack_1["default"])((0, webpack_dev_1["default"])(), function (err, stats) {
            if (err || (stats === null || stats === void 0 ? void 0 : stats.hasErrors())) {
                console.log('stats: ', stats);
            }
        });
    });
}
exports["default"] = webpackCommand;
