// plugin
const ESlintWebpackPlugin = require('eslint-webpack-plugin')
// node api
const path = require('path')
// config
const getBaseConfig = require('./webpack.base')
const { babelPresetGenerator } = require('./webpack.util')
// utils
const { merge } = require('webpack-merge')
const { outputDirPath, cacheDirPath } = require('./utils/path')
const { getCustomWebpack } = require('./utils/files')
/** type */
import type { Configuration } from 'webpack'
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server'

const devServer: DevServerConfiguration = {
  compress: true,
  port: 8800,
  static: {
    directory: outputDirPath
  }
}

function devConfig(): Configuration {
  const customWebpackConfig = getCustomWebpack() || {}
  const { config, ...otherConfig } = customWebpackConfig
  /** 生成babel preset */
  const babelPreset = babelPresetGenerator(otherConfig)
  const baseConfig = getBaseConfig(otherConfig)
  const devConfig = merge(baseConfig, {
    mode: 'development',
    devServer,
    module: {
      rules: [
        // 解析ts文件
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
        // 解析样式文件
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
  })
  return config ? config(devConfig) : devConfig
}

module.exports = devConfig
