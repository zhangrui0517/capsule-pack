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
    devServer
  })
  return config ? config(devConfig) : devConfig
}

export default devConfig