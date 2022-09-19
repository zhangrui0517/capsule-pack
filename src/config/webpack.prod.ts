// node api
const path = require('path')
// plugin
const PurgeCSSPlugin = require('purgecss-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
// config
const getBaseConfig = require('./webpack.base')
const { babelPresetGenerator } = require('./webpack.util')
// utils
const glob = require('glob')
const { merge } = require('webpack-merge')
const { projectPath, cacheDirPath } = require('./utils/path')
const { getCustomWebpack } = require('./utils/files')
/** type */
import { Configuration } from 'webpack'

function prodConfig(): Configuration {
  const customWebpackConfig = getCustomWebpack() || {}
  const { config, ...otherConfig } = customWebpackConfig
  const { root = 'src' } = otherConfig || {}
  /** 生成babel preset */
  const babelPreset = babelPresetGenerator(otherConfig)
  const baseConfig = getBaseConfig(otherConfig)
  const prodConfig = merge(baseConfig, {
    mode: 'production',
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
        // 压缩js
        new TerserWebpackPlugin({
          parallel: true,
          terserOptions: {
            output: {
              // 清除注释
              comments: false
            }
          },
          // 不提取注释到另外的文件中
          extractComments: false
        }),
        // 压缩css
        new CssMinimizerPlugin({
          parallel: true,
          minimizerOptions: {
            preset: [
              'default',
              {
                // 清除注释
                discardComments: { removeAll: true }
              }
            ]
          }
        })
      ]
    }
  })
  return config ? config(prodConfig) : prodConfig
}

module.exports = prodConfig
