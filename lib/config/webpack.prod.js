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
const path_1 = __importDefault(require("path"));
const purgecss_webpack_plugin_1 = __importDefault(require("purgecss-webpack-plugin"));
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const terser_webpack_plugin_1 = __importDefault(require("terser-webpack-plugin"));
const css_minimizer_webpack_plugin_1 = __importDefault(require("css-minimizer-webpack-plugin"));
const webpack_base_1 = __importDefault(require("./webpack.base"));
const webpack_util_1 = require("./webpack.util");
const glob_1 = __importDefault(require("glob"));
const webpack_merge_1 = require("webpack-merge");
const path_2 = require("../utils/path");
const files_1 = require("../utils/files");
function prodConfig() {
    const customWebpackConfig = (0, files_1.getCustomWebpack)() || {};
    const { config } = customWebpackConfig, otherConfig = __rest(customWebpackConfig, ["config"]);
    const { root = 'src' } = otherConfig || {};
    const babelPreset = (0, webpack_util_1.babelPresetGenerator)(otherConfig);
    const baseConfig = (0, webpack_base_1.default)(otherConfig);
    const prodConfig = (0, webpack_merge_1.merge)(baseConfig, {
        mode: 'production',
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
                        mini_css_extract_plugin_1.default.loader,
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
            new mini_css_extract_plugin_1.default({
                filename: '[name].[fullhash:6].css'
            }),
            new purgecss_webpack_plugin_1.default({
                paths: glob_1.default.sync(`${path_2.projectPath}/${root}/**/*`, { nodir: true })
            })
        ],
        optimization: {
            minimizer: [
                new terser_webpack_plugin_1.default({
                    parallel: true,
                    terserOptions: {
                        output: {
                            comments: false
                        }
                    },
                    extractComments: false
                }),
                new css_minimizer_webpack_plugin_1.default({
                    parallel: true,
                    minimizerOptions: {
                        preset: [
                            'default',
                            {
                                discardComments: { removeAll: true }
                            }
                        ]
                    }
                })
            ]
        }
    });
    return config ? config(prodConfig) : prodConfig;
}
exports.default = prodConfig;
