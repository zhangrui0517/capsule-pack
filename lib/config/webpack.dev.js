"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var webpack_base_1 = __importDefault(require("./webpack.base"));
var webpack_merge_1 = require("webpack-merge");
var utils_1 = require("../utils");
var devServer = {
    compress: true,
    port: 8800,
    static: {
        directory: utils_1.outputDirPath
    }
};
function devConfig() {
    var customWebpackConfig = (0, utils_1.getCustomWebpack)() || {};
    var config = customWebpackConfig.config, otherConfig = __rest(customWebpackConfig, ["config"]);
    var baseConfig = (0, webpack_base_1["default"])(otherConfig);
    var devConfig = (0, webpack_merge_1.merge)(baseConfig, {
        mode: 'development',
        devServer: devServer,
        module: {
            rules: [
                {
                    test: /\.(scss|css)$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 2
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        'postcss-preset-env'
                                    ]
                                }
                            }
                        },
                        'sass-loader'
                    ]
                },
            ]
        }
    });
    return config ? config(devConfig) : devConfig;
}
exports["default"] = devConfig;
