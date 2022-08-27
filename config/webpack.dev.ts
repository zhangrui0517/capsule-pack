import { Configuration } from 'webpack'
import { Configuration as DevServerConfiguration } from 'webpack-dev-server'
// node api
import path from 'path'
// config
import baseConfig from './webpack.base'
// utils
import { merge } from 'webpack-merge'
import { mergeExtraWebpackConfig } from '../utils'

const devServer: DevServerConfiguration = {
  compress: true,
  port: 8800,
  static: {
    directory: path.resolve(process.cwd(), './dist'),
  }
}

const devConfig: Configuration = merge(baseConfig, {
  mode: 'development',
  devServer
})

export default mergeExtraWebpackConfig(devConfig)