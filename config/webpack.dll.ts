import path from 'path'
import { DllPlugin, Configuration } from 'webpack'
// utils
import { dllDirPath, contextPath } from '../utils'

const dllConfig: Configuration = {
  mode: 'production',
  resolve: {
    extensions: ['.js', '.jsx']
  },
  entry: {
    react: ['react', 'react-dom'],
  },
  output: {
    path: dllDirPath,
    filename: '[name].dll.js',
    library: '[name]_[fullhash]'
  },
  plugins: [
    new DllPlugin({
      path: path.resolve(dllDirPath, '[name]-manifest.json'),
      name: '[name]_[fullhash]',
      context: contextPath,
      entryOnly: true
    })
  ]
}

export default dllConfig