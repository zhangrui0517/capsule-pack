import { Configuration } from 'webpack'
import { Configuration as DevServerConfiguration } from 'webpack-dev-server'
// plugin
import ESlintWebpackPlugin from 'eslint-webpack-plugin'
// node api
import path from 'path'
// config
import getBaseConfig from './webpack.base'
import { babelPresetGenerator } from './webpack.util'
// utils
import { merge } from 'webpack-merge'
import { outputDirPath, getCustomWebpack, cacheDirPath } from './utils'

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

export default devConfig
