var path = require('path');
var resolveHere = function(folder) { return path.resolve(__dirname, folder); };
var assignDeep = require('assign-deep');
var values = require('object-values');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var autoprefixer = require('autoprefixer');
var cssnested = require('postcss-nested');
var postcssclearfix = require('postcss-clearfix');
var packageJson = require('./package.json');

var env = process.env.NODE_ENV || 'development';

var webpackConfig = {
  entry: {
    app: [
      // 'babel-polyfill',
      resolveHere('src/index')
    ]
  },
  output: {
    path: resolveHere('build'),
    filename: '[name].[hash].js',
    pathinfo: true
  },
  resolve: {
    root: resolveHere('src'),
    alias: {
      'gl-matrix': 'gl-matrix/dist/gl-matrix-min.js'
    }
  },
  module: {
    loaders: values({
      js: {test: /\.js$/, loader: 'babel'},
      css: {test: /\.css$/, loader: 'style!css?modules&importLoaders=1&localIdentName=[name]-[local]-[hash:base64:5]!postcss'},

      // Shaders
      shader: {test: /\.(glsl|frag|vert|fs|vs)$/, loader: 'raw!glslify'},

      // Images
      png: {test: /\.png$/, loader: 'url?limit=8192&mimetype=image/png'},
      gif: {test: /\.gif$/, loader: 'url?limit=8192&mimetype=image/gif'},
      jpg: {test: /\.jpe?g$/, loader: 'file'},
      svg: {test: /\.svg$/, loader: 'file'},

      // Fonts
      woff2: {test: /\.woff2$/, loader: 'url?limit=8192&mimetype=application/font-woff2'},
      woff: {test: /\.woff$/, loader: 'url?limit=8192&mimetype=application/font-woff'},
      ttf: {test: /\.ttf$/, loader: 'file'},
      eot: {test: /\.eot$/, loader: 'file'},

      // Other
      json: {test: /\.json$/, loader: 'json'},
      html: {test: /\.html$/, loader: 'file?name=[name].[ext]'},
      md:   {test: /\.md$/, loader: 'file?name=[name].[ext]'}
    }),
    noParse: [
      /(\.|-)min\.js$/,
      /node_modules$/,
    ]
  },
  postcss: [
    autoprefixer({ browsers: ['last 2 versions'] }),
    cssnested,
    postcssclearfix
  ],
  plugins: [
    new HtmlWebpackPlugin({
      title: packageJson.name,
      template: 'src/index.html',
      inject: 'body',
      description: packageJson.description,
      version: packageJson.version
    }),
    new ExtractTextPlugin('style.[contenthash].css', {allChunks: true}),
  ]
};

module.exports = webpackConfig;
