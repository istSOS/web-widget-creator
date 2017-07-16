const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    'bundle': ['./src/App.jsx']
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
    alias: {
      'intro': path.resolve(__dirname, 'src/components/intro/Intro.jsx'),
      'main': path.resolve(__dirname, 'src/components/main/Main.jsx')
    },
    extensions: [".js", ".jsx", ".json"]
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './',
    port: 9001
  }
};