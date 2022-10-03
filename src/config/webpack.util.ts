import path from 'path'
import { polyfillIO } from '../utils/resource'
import htmlWebpackInsertAsset from '../plugins/htmlWebpackInsertAsset'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import HtmlWebpackPlugins from 'html-webpack-plugin'
import { projectPath } from '../utils/path'
/** type */
import { CustomExtraConfig } from '../types'
import { Configuration } from 'webpack'

/** 设置分析插件到plugin中 */
export function setAnalyzerPlugin(extraConfig: CustomExtraConfig, config: Configuration) {
  const { analyzer } = extraConfig
  if (analyzer) {
    config.plugins = config.plugins || []
    config.plugins.push(new BundleAnalyzerPlugin(analyzer))
  }
}

/** 设置HtmlWebpackPlugins */
export function setHtmlPlugin(extraConfig: CustomExtraConfig, config: Configuration) {
  const { html = true, root = 'src' } = extraConfig
  if (html) {
    const defaultTemplate = path.resolve(projectPath, `./${root}/index.html`)
    config.plugins = config.plugins || []
    config.plugins.push(
      new HtmlWebpackPlugins({
        template: typeof html === 'object' && html.template ? html.template : defaultTemplate
      })
    )
    setPolyfillHtml(extraConfig, config)
  }
}

/** 根据自定义参数，插入polyfill脚本到html中 */
export function setPolyfillHtml(extraConfig: CustomExtraConfig, config: Configuration) {
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
