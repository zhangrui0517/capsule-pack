import { Configuration } from 'webpack'

export type CustomConfig = {
  /** webpackConfig 配置回调，返回的值是webpack打包使用的最终配置 */
  config?: (webapckConfig: Configuration) => Configuration
} & CustomExtraConfig

export type CustomExtraConfig = {
  /** 是否开启react支持, 默认为true */
  react?: boolean
  /** 要打包的目录，默认为src */
  root?: string
  /** 是否需要生成HTML文件 */
  html?:
    | {
        template?: string
      }
    | boolean
  /** 是否需要动态polyfill，默认关闭，开启默认使用jsdelivr CDN */
  dynamicPolyfill?: true
  /** 动态polyfill 所使用的CDN，仅在dynamicPolyfill为true时使用 */
  dynamicPolyfillCDN?: string
}
