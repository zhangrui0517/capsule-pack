import { Configuration } from 'webpack'
import baseConfig from './webpack.base'
import { merge } from 'webpack-merge'

const devConfig: Configuration = {
  mode: 'development'
}

export default merge(baseConfig, devConfig)