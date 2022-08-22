import { Configuration } from 'webpack'
import baseConfig from './webpack.base'
import { merge } from 'webpack-merge'
import { mergeExtraWebpackConfig } from '../utils'

const devConfig: Configuration = merge(baseConfig, {
  mode: 'development'
})

export default mergeExtraWebpackConfig(devConfig)