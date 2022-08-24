import { Configuration } from 'webpack'
// config
import baseConfig from './webpack.base'
// utils
import { merge } from 'webpack-merge'
import { mergeExtraWebpackConfig } from '../utils'

const prodConfig: Configuration = merge(baseConfig, {
  mode: 'production',
})

export default mergeExtraWebpackConfig(prodConfig)