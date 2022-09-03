import HtmlWebpackPlugins from 'html-webpack-plugin'
import { Compiler, Compilation } from "webpack";

export type Options = {
  src: string
}

class HtmlWebpackInsertAsset {
  private src = ''
  constructor (options: Options) {
    const { src } = options || {}
    if(!src) {
      throw Error('The src option is required')
    }
    this.src = src
  }
  apply (compiler: Compiler) {
    compiler.hooks.compilation.tap('HtmlWebpackInsertAsset', (compilation: Compilation) => {
      HtmlWebpackPlugins.getHooks(compilation).beforeAssetTagGeneration.tapAsync('HtmlWebpackInsertAsset', (data, cb) => {
        const { assets } = data
        const { js } = assets
        js.push(this.src)
        cb(null, data)
      })
    })
  }
}

export default HtmlWebpackInsertAsset