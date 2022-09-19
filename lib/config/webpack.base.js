"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HtmlWebpackPlugins = require('html-webpack-plugin');
const webpackBar = require('webpackBar');
const path = require('path');
const { projectPath, cacheDirPath } = require('./utils/path');
const { polyfillInsert } = require('./webpack.util');
function getBaseConfig(extraConfig = {}) {
    const { root = 'src' } = extraConfig;
    const config = {
        entry: {
            index: path.resolve(projectPath, `./${root}/index`)
        },
        output: {
            filename: '[name].[contenthash:6].js',
            path: path.resolve(projectPath, './dist'),
            clean: true
        },
        cache: {
            type: 'filesystem',
            cacheDirectory: path.resolve(cacheDirPath, './webpack')
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
                                    quality: [0.65, 0.9],
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
            new HtmlWebpackPlugins({
                template: path.resolve(projectPath, `./${root}/index.html`)
            }),
            new webpackBar()
        ],
        resolve: {
            modules: [path.resolve(projectPath, 'node_modules')],
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
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true
                    }
                }
            }
        }
    };
    polyfillInsert(extraConfig, config);
    return config;
}
module.exports = getBaseConfig;
