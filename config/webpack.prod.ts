import { Configuration } from 'webpack'
// plugin
import PurgeCSSPlugin from 'purgecss-webpack-plugin'
// config
import getBaseConfig from './webpack.base'
// utils
import glob from 'glob'
import { merge } from 'webpack-merge'
import { getCustomWebpack, contextPath } from '../utils'

function prodConfig (): Configuration {
  const customWebpackConfig = getCustomWebpack() || {}
  const { config, ...otherConfig } = customWebpackConfig
  const { root = 'src' } = otherConfig || {}
  const baseConfig = getBaseConfig(otherConfig)
  const prodConfig = merge(baseConfig, {
    mode: 'production',
    plugins: [
      new PurgeCSSPlugin({
        paths: glob.sync(`${contextPath}/${root}/**/*`,  { nodir: true }),
      }),
    ]
  })
  return config ? config(prodConfig) : prodConfig
}

export default prodConfig