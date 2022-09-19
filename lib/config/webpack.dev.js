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
const ESlintWebpackPlugin = require('eslint-webpack-plugin');
const path = require('path');
const getBaseConfig = require('./webpack.base');
const { babelPresetGenerator } = require('./webpack.util');
const { merge } = require('webpack-merge');
const { outputDirPath, cacheDirPath } = require('./utils/path');
const { getCustomWebpack } = require('./utils/file');
const devServer = {
    compress: true,
    port: 8800,
    static: {
        directory: outputDirPath
    }
};
function devConfig() {
    const customWebpackConfig = getCustomWebpack() || {};
    const { config } = customWebpackConfig, otherConfig = __rest(customWebpackConfig, ["config"]);
    const babelPreset = babelPresetGenerator(otherConfig);
    const baseConfig = getBaseConfig(otherConfig);
    const devConfig = merge(baseConfig, {
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
            new ESlintWebpackPlugin({
                extensions: ['ts', 'tsx', 'js', 'jsx']
            })
        ]
    });
    return config ? config(devConfig) : devConfig;
}
module.exports = devConfig;
