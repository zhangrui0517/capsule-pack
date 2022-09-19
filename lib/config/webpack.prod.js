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
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const PurgeCSSPlugin = require('purgecss-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const getBaseConfig = require('./webpack.base');
const { babelPresetGenerator } = require('./webpack.util');
const glob = require('glob');
const { merge } = require('webpack-merge');
const { projectPath, cacheDirPath } = require('./utils/path');
const { getCustomWebpack } = require('./utils/files');
function prodConfig() {
    const customWebpackConfig = getCustomWebpack() || {};
    const { config } = customWebpackConfig, otherConfig = __rest(customWebpackConfig, ["config"]);
    const { root = 'src' } = otherConfig || {};
    const babelPreset = babelPresetGenerator(otherConfig);
    const baseConfig = getBaseConfig(otherConfig);
    const prodConfig = merge(baseConfig, {
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
                                cacheDirectory: path.resolve(cacheDirPath, '.babel-cache'),
                                presets: babelPreset
                            }
                        }
                    ],
                    exclude: /node_modules/
                },
                {
                    test: /\.(scss|css)$/,
                    use: [
                        MiniCssExtractPlugin.loader,
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
            new MiniCssExtractPlugin({
                filename: '[name].[fullhash:6].css'
            }),
            new PurgeCSSPlugin({
                paths: glob.sync(`${projectPath}/${root}/**/*`, { nodir: true })
            })
        ],
        optimization: {
            minimizer: [
                new TerserWebpackPlugin({
                    parallel: true,
                    terserOptions: {
                        output: {
                            comments: false
                        }
                    },
                    extractComments: false
                }),
                new CssMinimizerPlugin({
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
module.exports = prodConfig;
