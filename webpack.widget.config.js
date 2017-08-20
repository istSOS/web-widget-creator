const path = require('path');
const webpack = require('webpack');
const ClosureCompilerPlugin = require('webpack-closure-compiler');
module.exports = {
   context: path.resolve(__dirname, './lib'),
   entry: {
      app: './index.js'
   },
   output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'istsos-widget.min.js',
      library: 'istsosWidget',
      libraryTarget: 'umd',
   },
   resolve: {
      alias: {
      	'WidgetTypes': path.resolve(__dirname, 'lib/WidgetTypes.js'),
      	'WidgetFunctions': path.resolve(__dirname, 'lib/WidgetFunctions.js'),
         'Widget': path.resolve(__dirname, 'lib/Widget.js'),
      	'Map': path.resolve(__dirname, 'lib/Map.js')
      }
   },
   module: {
      rules: [
         {
            test: /\.js$/,
            exclude: [/node_modules/],
            use: [{
               loader: 'babel-loader',
               options: {
                  presets: ['es2015']
               },
            }],
         }
      ],
   },
   // plugins: [
   //    new ClosureCompilerPlugin({
   //       compiler: {
   //          language_in: 'ECMASCRIPT6',
   //          language_out: 'ECMASCRIPT5',
   //          compilation_level: 'WHITESPACE_ONLY'
   //       },
   //       concurrency: 3,
   //    })
   // ]
};