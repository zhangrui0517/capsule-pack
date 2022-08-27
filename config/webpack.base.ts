import { Configuration, DllReferencePlugin } from "webpack"
// plugins
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import HtmlWebpackPlugins from 'html-webpack-plugin'
import TerserWebpackPlugin from 'terser-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
// import CopyWebpackPlugin from 'copy-webpack-plugin'
import AddAssetHtmlWebpackPlugin from 'add-asset-html-webpack-plugin'
// node api
import path from 'path'
// utils
import { contextPath } from './constant'

// 当前执行路径


const config: Configuration = {
  entry: {
    index: path.resolve(contextPath, './src/index')
  },
  output: {
    filename: '[name].[contenthash:6].js',
    path: path.resolve(contextPath, './dist'),
    // 清除上一次的构建产物
    clean: true,
    publicPath:'./'
  },
  cache: {
    type: 'filesystem',
    cacheDirectory: path.resolve(contextPath, './node_modules/.cache/webpack')
  },
  module: {
    rules: [
      // 解析ts文件
      {
        test: /\.(ts|tsx|js|jsx)$/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              worker: 2
            }
          },
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: path.resolve(contextPath, './node_modules/.cache/babel-cache'),
              presets: ['@babel/preset-typescript', '@babel/preset-react', '@babel/preset-env'], 
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
          filename: 'static/images/[name]-[hash:6][ext][query]'
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
          filename: 'static/fonts/[name]-[hash][ext][query]'
        },
      },
      // 处理内联文件
      {
        resourceQuery: /raw/,
        type: 'asset/source',
        generator: {
          filename: 'static/raw/[name]-[hash][ext][query]'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugins({
      template: path.resolve(contextPath, './src/index.html')
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:6].css'
    }),
    new DllReferencePlugin({
      context: contextPath,
      manifest: path.resolve(contextPath, './dlls/react-manifest.json')
    }),
    // new CopyWebpackPlugin({
    //   patterns: [{
    //     from: path.resolve(contextPath, './dlls/react.dll.js'),
    //     to: path.resolve(contextPath, './dist')
    //   }]
    // }),
    new AddAssetHtmlWebpackPlugin({
      filepath: path.resolve(contextPath, './dlls/react.dll.js')
    })
  ],
  resolve: {
    extensions: ['.ts','.js','.tsx','.jsx']
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

export default config