import { Configuration } from 'webpack'
// plugins
import HtmlWebpackPlugins from 'html-webpack-plugin'
// import webpackBar from 'webpackBar'
// node api
import path from 'path'
// utils
import { projectPath, cacheDirPath } from './utils'
import { polyfillInsert } from './webpack.util'
// types
import { CustomExtraConfig } from '../types'

function getBaseConfig(extraConfig: CustomExtraConfig = {}): Configuration {
  const { root = 'src' } = extraConfig
  const config: Configuration = {
    entry: {
      index: path.resolve(projectPath, `./${root}/index`)
    },
    output: {
      filename: '[name].[contenthash:6].js',
      path: path.resolve(projectPath, './dist'),
      // 清除上一次的构建产物
      clean: true,
    },
    cache: {
      type: 'filesystem',
      cacheDirectory: path.resolve(cacheDirPath, './webpack')
    },
    module: {
      rules: [
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
        template: path.resolve(projectPath, `./${root}/index.html`)
      }),
      // new webpackBar()
    ],
    resolve: {
      modules: [path.resolve(projectPath, 'node_modules')],
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
      }
    }
  }
  /** 根据参数按需插入polyfill脚本 */
  polyfillInsert(extraConfig, config)
  return config
}

export default getBaseConfig