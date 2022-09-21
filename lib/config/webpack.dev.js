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
Object.defineProperty(exports, "__esModule", { value: true });
const eslint_webpack_plugin_1 = __importDefault(require("eslint-webpack-plugin"));
const path_1 = __importDefault(require("path"));
const webpack_base_1 = __importDefault(require("./webpack.base"));
const webpack_util_1 = require("./webpack.util");
const webpack_merge_1 = require("webpack-merge");
const path_2 = require("../utils/path");
const files_1 = require("../utils/files");
const devServer = {
    compress: true,
    port: 8800,
    static: {
        directory: (0, path_2.getOutputDirPath)()
    }
};
function devConfig() {
    const customWebpackConfig = (0, files_1.getCustomWebpack)() || {};
    const { config } = customWebpackConfig, otherConfig = __rest(customWebpackConfig, ["config"]);
    const babelPreset = (0, webpack_util_1.babelPresetGenerator)(otherConfig);
    const baseConfig = (0, webpack_base_1.default)(otherConfig);
    const devConfig = (0, webpack_merge_1.merge)(baseConfig, {
        mode: 'development',
        devServer,
        module: {
            rules: [
                {
                    test: /\.(ts|tsx|js|jsx)$/,
                    use: [
                        {
                            loader: 'thread-loader'
                        },
                        {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: path_1.default.resolve((0, path_2.getCacheDirPath)(), '.babel-cache'),
                                presets: babelPreset
                            }
                        }
                    ],
                    exclude: /node_modules/
                },
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
                                    plugins: ['postcss-preset-env']
                                }
                            }
                        },
                        'sass-loader'
                    ]
                }
            ]
        },
        plugins: [
            new eslint_webpack_plugin_1.default({
                extensions: ['ts', 'tsx', 'js', 'jsx']
            })
        ]
    });
    return config ? config(devConfig) : devConfig;
}
exports.default = devConfig;
