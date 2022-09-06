import { Configuration } from "webpack"
// plugins
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import HtmlWebpackPlugins from 'html-webpack-plugin'
import TerserWebpackPlugin from 'terser-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import webpackBar from 'webpackBar'
// node api
import path from 'path'
// utils
import { rootPath, cacheDirPath } from '../utils'
import { polyfillInsert, babelPresetGenerator } from './webpack.util'
// types
import { CustomExtraConfig } from '../types'

function getBaseConfig(extraConfig: CustomExtraConfig = {}): Configuration {
  const { root = 'src' } = extraConfig
  /** 生成babel preset */
  const babelPreset = babelPresetGenerator(extraConfig)
  const config: Configuration = {
    entry: {
      index: path.resolve(rootPath, `./${root}/index`)
    },
    output: {
      filename: '[name].[contenthash:6].js',
      path: path.resolve(rootPath, './dist'),
      // 清除上一次的构建产物
      clean: true,
    },
    cache: {
      type: 'filesystem',
      cacheDirectory: path.resolve(cacheDirPath, './webpack')
    },
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
                presets: babelPreset, 
              },
            },
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
                  plugins: [
                    'postcss-preset-env'
                  ]
                }
              }
            },
            'sass-loader'
          ]
        },
        // 处理图片资源
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          use: [
            {
              loader: 'image-webpack-loader',
              options: {
                mozjpeg: {
                  progressive: true,
                },
                optipng: {
                  enabled: false,
                },
                pngquant: {
                  quality: [0.65, 0.90],
                  speed: 4
                },
                gifsicle: {
                  interlaced: false,
                },
                webp: {
                  quality: 75
                }
              }
            }
          ],
          // 不指定具体类型时，webpack会自动在resource（file-loader）和inline（url-loader）之间选择
          type: 'asset',
          // 自定义文件名称
          generator: {
            filename: 'static/images/[name]-[contenthash:6][ext][query]'
          },
          parser: {
            dataUrlCondition: {
              maxSize: 4 * 1024
            }
          }
        },
        // 处理字体资源
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'static/fonts/[name]-[contenthash][ext][query]'
          },
        },
        // 处理内联文件
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
        template: path.resolve(rootPath, `./${root}/index.html`)
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[fullhash:6].css'
      }),
      new webpackBar()
    ],
    resolve: {
      extensions: ['.ts','.tsx','.js','.jsx']
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
      },
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
  }
  polyfillInsert(extraConfig, config)
  return config
}

export default getBaseConfig