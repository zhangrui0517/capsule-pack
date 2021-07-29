const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    index: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(process.env.BUNDLE_PREFIX_PATH, 'dist'),
    clean: true
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader']
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
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    })
  ],
  optimization: {
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
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
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