"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
var path_1 = __importDefault(require("path"));
var utils_1 = require("./utils");
var webpack_util_1 = require("./webpack.util");
function getBaseConfig(extraConfig) {
    if (extraConfig === void 0) { extraConfig = {}; }
    var _a = extraConfig.root, root = _a === void 0 ? 'src' : _a;
    var config = {
        entry: {
            index: path_1["default"].resolve(utils_1.projectPath, "./".concat(root, "/index"))
        },
        output: {
            filename: '[name].[contenthash:6].js',
            path: path_1["default"].resolve(utils_1.projectPath, './dist'),
            clean: true
        },
        cache: {
            type: 'filesystem',
            cacheDirectory: path_1["default"].resolve(utils_1.cacheDirPath, './webpack')
        },
        module: {
            rules: [
                {
                    test: /\.(png|svg|jpg|jpeg|gif)$/i,
                    use: [
                        {
                            loader: 'image-webpack-loader',
                            options: {
                                mozjpeg: {
                                    progressive: true
                                },
                                optipng: {
                                    enabled: false
                                },
                                pngquant: {
                                    quality: [0.65, 0.90],
                                    speed: 4
                                },
                                gifsicle: {
                                    interlaced: false
                                },
                                webp: {
                                    quality: 75
                                }
                            }
                        }
                    ],
                    type: 'asset',
                    generator: {
                        filename: 'static/images/[name]-[contenthash:6][ext][query]'
                    },
                    parser: {
                        dataUrlCondition: {
                            maxSize: 4 * 1024
                        }
                    }
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'static/fonts/[name]-[contenthash][ext][query]'
                    }
                },
                {
                    resourceQuery: /raw/,
                    type: 'asset/source',
                    generator: {
                        filename: 'static/raw/[name]-[contenthash][ext][query]'
                    }
                }
            ]
        },
        plugins: [
            new html_webpack_plugin_1["default"]({
                template: path_1["default"].resolve(utils_1.projectPath, "./".concat(root, "/index.html"))
            }),
        ],
        resolve: {
            modules: [path_1["default"].resolve(utils_1.projectPath, 'node_modules')],
            extensions: ['.ts', '.tsx', '.js', '.jsx']
        },
        optimization: {
            minimize: true,
            splitChunks: {
                chunks: 'all',
                name: 'common',
                cacheGroups: {
                    defaultVendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10
                    },
                    "default": {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true
                    }
                }
            }
        }
    };
    (0, webpack_util_1.polyfillInsert)(extraConfig, config);
    return config;
}
exports["default"] = getBaseConfig;
