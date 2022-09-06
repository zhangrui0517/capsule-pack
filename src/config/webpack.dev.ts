import { Configuration } from 'webpack'
import { Configuration as DevServerConfiguration } from 'webpack-dev-server'
// config
import getBaseConfig from './webpack.base'
// utils
import { merge } from 'webpack-merge'
import { outputDirPath, getCustomWebpack } from '../utils'

const devServer: DevServerConfiguration = {
  compress: true,
  port: 8800,
  static: {
    directory: outputDirPath,
  }
}

function devConfig (): Configuration {
  const customWebpackConfig = getCustomWebpack() || {}
  const { config, ...otherConfig } = customWebpackConfig
  const baseConfig = getBaseConfig(otherConfig)
  const devConfig = merge(baseConfig, {
    mode: 'development',
    devServer,
    module: {
      rules: [
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
    }
  })
  return config ? config(devConfig) : devConfig
}

export default devConfig