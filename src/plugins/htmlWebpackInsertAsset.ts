import HtmlWebpackPlugins from 'html-webpack-plugin'
import { Compiler, Compilation } from 'webpack'

export type Options = Array<{
  tag: 'meta' | 'script' | 'link'
  attributes: {
    src: string
  } & Record<string, any>
  /** 插入的位置，默认为after */
  position?: 'before' | 'after'
}>

export type TagToAssetTagsMap = {
  script: 'scripts'
  link: 'styles'
  meta: 'meta'
}

class HtmlWebpackInsertAsset {
  options: Options = []
  constructor (options: Options) {
    this.options = options
  }
  private tagToAssetTagsMap: TagToAssetTagsMap = {
    script: 'scripts',
    link: 'styles',
    meta: 'meta'
  }
  apply (compiler: Compiler) {
    compiler.hooks.compilation.tap('HtmlWebpackInsertAsset', (compilation: Compilation) => {
      const htmlWebpackHooks = HtmlWebpackPlugins.getHooks(compilation)
      htmlWebpackHooks.alterAssetTags.tapAsync('HtmlWebpackInsertAsset', (data, cb) => {
        const { assetTags } = data
        this.options.forEach(optionItem => {
          const { tag, attributes, position = 'after' } = optionItem
          const assetTag = this.tagToAssetTagsMap[tag]
          const currentTags = assetTags[assetTag]
          currentTags[position === 'after' ? 'push' : 'unshift']({
            tagName: tag,
            voidTag: false,
            attributes,
            meta: currentTags[0]?.meta || {
              plugin: 'html-webpack-plugin'
            }
          })
        })
        cb(null, data)
      })
    })
  }
}

export default HtmlWebpackInsertAsset