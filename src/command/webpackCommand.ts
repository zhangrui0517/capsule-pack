import Webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import { Command } from 'commander'
import devConfig from '../config/webpack.dev'
import prodConfig from '../config/webpack.prod'

function webpackCommand(program: Command) {
  program
    .command('dev')
    .description('构建开发环境产物')
    .action(() => {
      Webpack(devConfig(), (err, stats) => {
        if(stats) {
          if (err || stats.hasErrors()) {
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
      server.startCallback(() => {
        console.log('Successfully started')
      })
      server.stopCallback(() => {
        console.log('Successfully stop')
      })
      server.start()
    })
    program
    .command('build')
    .description('构建生产环境产物')
    .action(() => {
      Webpack(prodConfig(), (err, stats) => {
        if(stats) {
          if (err || stats.hasErrors()) {
          }
          console.log(stats.toString())
        }
      })
    })
}

export default webpackCommand