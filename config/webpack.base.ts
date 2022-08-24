import { Configuration } from "webpack"
import { Configuration as DevServerConfiguration } from 'webpack-dev-server'
// plugins
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import HtmlWebpackPlugins from 'html-webpack-plugin'
// node api
import path from 'path'

const devServer: DevServerConfiguration = {
  compress: true,
  port: 8080,
  static: {
    directory: path.resolve(process.cwd(), './dist')
  }
}

const config: Configuration = {
  entry: {
    index: path.resolve(process.cwd(), './src/index')
  },
  output: {
    filename: '[name].[contenthash:6].js',
    path: path.resolve(process.cwd(), './dist'),
    // 清除上一次的构建产物
    clean: true
  },
  module: {
    rules: [
      // 解析ts文件
      {
        test: /\.(ts|tsx|js|jsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-typescript', '@babel/preset-react', '@babel/preset-env'], 
          },
        },
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
        // 不指定具体类型时，webpack会自动在resource（file-loader）和inline（url-loader）之间选择
        type: 'asset',
        // 自定义文件名称
        generator: {
          filename: 'static/images/[name]-[hash][ext][query]'
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
      template: path.resolve(process.cwd(), './src/index.html')
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:6].css'
    })
  ],
  devServer,
  resolve: {
    extensions: ['.ts','.js','.tsx','.jsx']
  }
}

export default config