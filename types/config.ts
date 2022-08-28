import { Configuration } from 'webpack'

export type CustomConfig = {
  /** webpackConfig 配置回调，返回的值是webpack打包使用的最终配置 */
  config?: (webapckConfig: Configuration) => Configuration 
} & CustomExtraConfig

export type CustomExtraConfig = {
  /** 要打包的目录，默认为src */
  root?: string
}