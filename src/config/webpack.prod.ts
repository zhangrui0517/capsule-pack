import { Configuration } from 'webpack'
// plugin
import PurgeCSSPlugin from 'purgecss-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import TerserWebpackPlugin from 'terser-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
// config
import getBaseConfig from './webpack.base'
// utils
import glob from 'glob'
import { merge } from 'webpack-merge'
import { getCustomWebpack, rootPath } from '../utils'

function prodConfig (): Configuration {
  const customWebpackConfig = getCustomWebpack() || {}
  const { config, ...otherConfig } = customWebpackConfig
  const { root = 'src' } = otherConfig || {}
  const baseConfig = getBaseConfig(otherConfig)
  const prodConfig = merge(baseConfig, {
    mode: 'production',
    module: {
      rules: [
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
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].[fullhash:6].css'
      }),
      new PurgeCSSPlugin({
        paths: glob.sync(`${rootPath}/${root}/**/*`,  { nodir: true }),
      }),
    ],
    optimization: {
      minimizer: [
        // 压缩js
        new TerserWebpackPlugin({
          parallel: true,
          terserOptions: {
            output: {
              // 清除注释
              comments: false,
            },
          },
          // 不提取注释到另外的文件中
          extractComments: false,
        }),
        // 压缩css
        new CssMinimizerPlugin({
          parallel: true,
          minimizerOptions: {
            preset: [
              'default',
              {
                // 清除注释
                discardComments: { removeAll: true },
              }
            ],
          }
        })
      ]
    }
  })
  return config ? config(prodConfig) : prodConfig
}

export default prodConfig