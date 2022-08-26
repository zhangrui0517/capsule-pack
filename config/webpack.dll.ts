import path from 'path'
import { DllPlugin, Configuration } from 'webpack'
// utils
import { contextPath } from './constant'

const dllConfig: Configuration = {
  mode: 'production',
  resolve: {
    extensions: ['.js', '.jsx']
  },
  entry: {
    react: ['react', 'react-dom']
  },
  output: {
    path: path.resolve(contextPath, './dlls'),
    filename: '[name].dll.js',
    library: '[name]'
  },
  plugins: [
    new DllPlugin({
      path: path.resolve(contextPath, './dlls', '[name]-manifest.json'),
      name: '[name]',
      context: process.cwd(),
      entryOnly: true
    })
  ]
}

export default dllConfig