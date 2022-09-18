import { Configuration } from 'webpack'
import { CustomExtraConfig } from '../types'
import { polyfillIO } from './utils'
import htmlWebpackInsertAsset from '../plugins/htmlWebpackInsertAsset'

/** 根据自定义参数，插入polyfill脚本到html中 */
export function polyfillInsert(extraConfig: CustomExtraConfig, config: Configuration) {
  const { dynamicPolyfill, dynamicPolyfillCDN } = extraConfig
  if (dynamicPolyfill) {
    config.plugins = config.plugins || []
    config.plugins.push(
      new htmlWebpackInsertAsset([
        {
          tag: 'script',
          attributes: {
            src: dynamicPolyfillCDN || polyfillIO,
            defer: true
          },
          position: 'before'
        }
      ])
    )
  }
  return config
}

/** 根据参数生成babel要加载的预置编译器 */
export function babelPresetGenerator(extraConfig: CustomExtraConfig) {
  const { react = true } = extraConfig
  const presetResult = ['@babel/preset-typescript', '@babel/preset-env']
  if (react) {
    presetResult.push('@babel/preset-react')
  }
  return presetResult
}
