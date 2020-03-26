module.exports = {
  output: {
    filename: '[name].js',
  },
  devtool: 'source-map',
  mode: 'production',
  optimization: {
    splitChunks: {
      cacheGroups: {
        libs: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          name: 'libs',
          filename: 'libs.js',
        },
      },
    },
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
    }],
  },
};
