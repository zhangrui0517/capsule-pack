const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const WebpackBar = require('webpackbar')
const path = require('path')

module.exports = {
  entry: {
    index: './src/index'
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(process.env.BUNDLE_PREFIX_PATH || __dirname, 'dist'),
    clean: true,
    /** 如果要打包一个js library */
    // library: {
    //   name: 'webpackNumbers',
    //   /** 包适配的规范 */
    //   type: 'umd',
    // },
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', 'jsx'],
  },
  module: {
    rules: [{
      oneOf: [
        /** 处理JS，如转换ES6代码为ES5 */
        {
          test: /\.(jsx|js|ts|tsx)$/i,
          include: /(src)/,
          exclude: /(node_modules)/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', {
                    "targets": {
                      /** 目标浏览器 */
                      browsers: [
                        'IE 11'
                      ]
                    },
                    /** 在兼容目标为ES5环境，当使用ES6特性时，会自动使用对应的polyfill进行转换 */
                    "useBuiltIns": "usage",
                    "corejs": 3
                  }],
                  ['@babel/preset-react']
                ],
                plugins: [
                  [
                    /** 用来抽离babel转换代码前面插入的helpers代码 */
                    '@babel/plugin-transform-runtime',
                    {
                      /** preset-env 已包含不污染全局的转换器 */
                      regenerator: false
                    }
                  ]
                ],
                /** 是否缓存目录，开启该项可以加速babel编译速度 */
                cacheDirectory: true,
                /** 不开启对缓存的压缩，会多占运存，减少磁盘占用，但运存显然更重要 */
                cacheCompression: false
              }
            },
            {
              loader: 'ts-loader',
              options: {
                /** 关闭类型检查，由fork-ts-checker-webpack-plugin单独开一个线程做类型检查 */
                transpileOnly: true
              }
            }
          ]
        },
        /** 处理样式 */
        {
          test: /\.s[ac]ss$/i,
          // use: ['style-loader', 'css-loader', 'sass-loader']
          use: [
            /** MiniCssExtractPlugin.loader 提取css到单独的文件中 */
            MiniCssExtractPlugin.loader,
            /** 解析css文件 */
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2
              }
            },
            /** 对css进行处理，如补全前缀 */
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    require('postcss-preset-env')({
                      browsers: [
                        "ie >= 9",
                        "Chrome >= 21",
                        "Firefox >= 1",
                        "Edge >= 13",
                        "last 3 versions"
                      ],
                    })
                  ],
                },
              },
            },
            /** 解析scss文件 */
            'sass-loader'
          ]
        },
        /** 处理图片资源 */
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          /** 不指定具体类型时，webpack会自动在resource（file-loader）和inline（url-loader）之间选择 */
          type: 'asset',
          /** 自定义文件名称 */
          generator: {
            filename: 'static/images/[name]-[hash][ext][query]'
          },
          parser: {
            dataUrlCondition: {
              maxSize: 4 * 1024
            }
          }
        },
        /** 处理字体资源 */
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'static/fonts/[name]-[hash][ext][query]'
          },
        },
        /** 处理内联文件 */
        {
          resourceQuery: /raw/,
          type: 'asset/source',
          generator: {
            filename: 'static/raw/[name]-[hash][ext][query]'
          }
        }
      ]
    }]
  },
  plugins: [
    /** HTML模板 */
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    /** 提取样式文件 */
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    /** ts 类型检查（额外线程，加快打包速度） */
    new ForkTsCheckerWebpackPlugin({}),
    /** 进度条 */
    new WebpackBar({
      color: '#4285f4'
    })
  ],
  optimization: {
    runtimeChunk: 'single',
    moduleIds: 'deterministic',
    splitChunks: {
      /**
       * 有效值为 all，async 和 initial
       * all, 意味着 chunk 可以在异步和非异步 chunk 之间共享
       */
      chunks: 'all',
      /** 生成 chunk 的最小体积（以 bytes 为单位） */
      minSize: 20000,
      /** 拆分前必须共享模块的最小 chunks 数 */
      minChunks: 1,
      /** 按需加载时的最大并行请求数 */
      maxAsyncRequests: 30,
      /** 入口点的最大并行请求数 */
      maxInitialRequests: 30,
      /** 缓存组的配置，会覆盖掉默认配置，用于自定义部分模块的分割方式； */
      cacheGroups: {
        defaultVendors: {
          /** 匹配所有第三方模块 */
          test: /[\\/]node_modules[\\/]/,
          /** 拆分模块名称 */
          name: 'vendors',
          /** 优先级 */
          priority: -10,
          /** 是否重用已经拆分出的模块 */
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    }
  }
}