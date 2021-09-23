const defaultConfig = {
  devServer: {
    contentBase: './dist',
    compress: true,
    hot: true,
    stats: {
      all: false
    }
  }
}

exports.defaultConfig = defaultConfig