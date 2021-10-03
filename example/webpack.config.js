const path = require('path');
const webpack = require('webpack');

const isDev = process.env.NODE_ENV === 'development';
console.log('开发环境：' + isDev);

const config = {
  entry: {
    index: './index.js'
  },
  output: {
    path: path.resolve('./www/'),
    filename: 'js/[name]_[hash:6].js',
    chunkFilename: 'js/[name]_[hash:6].chunk.js',
  },
  module: {
    rules: [
      {
        test: /\.tileset$/,
        use: [
          {
            loader: path.resolve('../src/index.js'),
            options: {
              process: isDev,
              output: './output',
              name: '[name]_[hash:6].[ext]',
              outputPath: './',
              publicPath: './',
              // image: {},
              // json: {}
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimize: false
  }
};

if (isDev) {
  config.devtool = 'eval'; // https://webpack.js.org/configuration/devtool/#devtool
  config.devServer = {
    contentBase: './dist',
    hot: true,
    disableHostCheck: true
  };
}

module.exports = config;
