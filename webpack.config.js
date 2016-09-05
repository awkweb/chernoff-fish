var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  watch: true,
  context: path.join(__dirname, "src"),
  entry: "./js/app.js",
    output: {
    path: __dirname + "/src/",
    filename: "app.min.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react']
        }
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css!sass')
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('styles.css', {
      allChunks: true
    })
  ]
};
