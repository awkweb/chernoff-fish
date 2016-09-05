var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin('styles.css');
const extractHTML = new ExtractTextPlugin('index.html');

module.exports = {
  watch: true,
  context: path.join(__dirname, "src"),
  entry: "./js/app.js",
    output: {
    path: __dirname + "/docs/",
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
        loader: extractCSS.extract('css!sass')
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      {
        test: /\.html$/,
        loader: extractHTML.extract('html')
      }
    ]
  },
  plugins: [
    extractCSS,
    extractHTML
  ]
};
