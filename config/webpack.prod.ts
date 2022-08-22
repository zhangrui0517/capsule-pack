import { Configuration } from 'webpack'
import baseConfig from './webpack.base'
import { merge } from 'webpack-merge'

const prodConfig: Configuration = {
  mode: 'production'
}

export default merge(baseConfig, prodConfig)