import { Configuration } from 'webpack'
import { Configuration as DevServerConfiguration } from 'webpack-dev-server'
import path from 'path'
import baseConfig from './webpack.base'
import { merge } from 'webpack-merge'
import { mergeExtraWebpackConfig } from '../utils'

const devServer: DevServerConfiguration = {
  compress: true,
  port: 8080,
  static: {
    directory: path.resolve(process.cwd(), './dist')
  }
}

const devConfig: Configuration = merge(baseConfig, {
  mode: 'development',
  devServer
})

export default mergeExtraWebpackConfig(devConfig)