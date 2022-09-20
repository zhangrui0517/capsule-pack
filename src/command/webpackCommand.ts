import Webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import devConfig from '../config/webpack.dev'
import prodConfig from '../config/webpack.prod'
/** type */
import { Command } from 'commander'
import type { Stats } from 'webpack'


function webpackCommand(program: Command) {
  program
    .command('dev')
    .description('构建开发环境产物')
    .action(() => {
      Webpack(devConfig(), (err: Error | undefined, stats: Stats | undefined) => {
        if (stats) {
          if (err || stats.hasErrors()) {
            const error = err || stats.hasErrors()
            console.error(error)
          }
          console.log(stats.toString())
        }
      })
    })
  program
    .command('dev-server')
    .description('构建开发环境产物，并启动本地服务')
    .action(() => {
      const webpackConfig = devConfig()
      const compiler = Webpack(webpackConfig)
      const devServerOptions = { ...webpackConfig.devServer }
      const server = new WebpackDevServer(devServerOptions, compiler)
      server.start()
      server.startCallback(() => {
        console.log('Successfully started')
      })
      server.stopCallback(() => {
        console.log('Successfully stop')
      })
    })
  program
    .command('build')
    .description('构建生产环境产物')
    .action(() => {
      Webpack(prodConfig(), (err: Error | undefined, stats: Stats | undefined) => {
        if (stats) {
          if (err || stats.hasErrors()) {
            const error = err || stats.hasErrors()
            console.error(error)
          }
          console.log(stats.toString())
        }
      })
    })
}

export default webpackCommand
