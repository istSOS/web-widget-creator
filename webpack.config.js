const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    'bundle': ['./src/App.jsx'],
    'istsos-widget': ['./lib/index.js']
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
      'main': path.resolve(__dirname, 'src/components/main/Main.jsx'),
      'header': path.resolve(__dirname, 'src/components/main/Header.jsx'),
      'content': path.resolve(__dirname, 'src/components/main/content/Content.jsx'),
      'footer': path.resolve(__dirname, 'src/components/main/Footer.jsx'),
      'home': path.resolve(__dirname, 'src/components/main/content/Home.jsx'),
      'tool': path.resolve(__dirname, 'src/components/main/content/Tool.jsx'),
      'sidebar-map': path.resolve(__dirname, 'src/components/main/content/sidebar/SidebarMap.jsx'),
      'sidebar-box': path.resolve(__dirname, 'src/components/main/content/sidebar/SidebarBox.jsx'),
      'sidebar-chart': path.resolve(__dirname, 'src/components/main/content/sidebar/SidebarChart.jsx'),
      'display': path.resolve(__dirname, 'src/components/main/content/display/Display.jsx'),
      'preview': path.resolve(__dirname, 'src/components/main/content/display/preview/Preview.jsx'),
      'code': path.resolve(__dirname, 'src/components/main/content/display/code/Code.jsx'),
    },
    extensions: [".js", ".jsx", ".json"]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin() // Enable HMR
  ],
  devServer: {
    historyApiFallback: true,
    contentBase: './',
    port: 9001,
    inline: true,
    hot: true
  }
};