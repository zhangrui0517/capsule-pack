import webpack from 'webpack'
import { Command } from 'commander'
import dev from '../config/webpack.dev'

function webpackCommand(program: Command) {
  program
    .command('dev')
    .action(() => {
      webpack(dev(), (err, stats) => { // [Stats Object](#stats-object)
        if (err || stats?.hasErrors()) {
          console.log('stats: ',stats)
          // [在这里处理错误](#error-handling)
        }
        // 处理完成
      })
    })
}

export default webpackCommand