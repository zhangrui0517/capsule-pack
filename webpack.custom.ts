// import path from 'path'
// import HtmlWebpackPlugins from 'html-webpack-plugin'
import { CustomConfig } from './src/types'

const config: CustomConfig = {
  root: 'test',
  dynamicPolyfill: true
  // 覆盖 webpack config
  // config: (webpackConfig) => {
  //   webpackConfig.plugins![0] = new HtmlWebpackPlugins({
  //     template: path.resolve(process.cwd(), './test/index.html')
  //   })
  //   return {
  //     ...webpackConfig,
  //     entry: {
  //       index: path.resolve(process.cwd(), './test/index'),
  //     }
  //   }
  // }
}

export default config