const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    'bundle': ['./src/app.jsx']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].min.js'
  },
  module: {
    rules: [{
      test: /.jsx?$/,
      exclude: /node_modules/,
      include: path.join(__dirname, 'src'),
      use: [{
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: [
            ['es2015', {
              modules: false
            }],
            'react',
          ],
        }
      }]
    }]
  },
  resolve: {
    alias: {},
    extensions: [".js", ".jsx", ".json"]
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './',
    port: 9001
  }
};