'use strict';

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const chalk = require('chalk');

const buildTime = {
  start: new Date().getTime(),
  end: new Date().getTime()
};

module.exports = function () {
  const cwd = process.cwd();

  return {
    entry: {
      'index': ['./index.js', './index.scss']
    },
    output: {
      path: path.join(cwd, 'dist'),
      filename: '[name].js',
      publicPath: '/dist/',
    },
    resolve: {
      extensions: ['*', '.js', '.jsx', '.json', '.md', '.scss', '.css']
    },
    externals: {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react',
      },
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom',
      },
    },
    module: {
      rules: [{
        test: /\.jsx?$/,
        loader: 'babel-loader',
        options: {
          presets: [require('babel-preset-env')]
        },
        exclude: /node_modules/,
      }, {
        test: /\.s?css$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'sass-loader'],
          fallback: 'style-loader'
        }),
        exclude: /node_modules/,
      }]
    },
    plugins: [
      new webpack.LoaderOptionsPlugin({
        minimize: true
      }),
      new ExtractTextPlugin({
        filename: '[name].css',
        allChunks: true
      }),
      new webpack.ProgressPlugin((percentage, msg) => {
        if (percentage === 0) {
          buildTime.start = new Date().getTime()
          console.log(chalk.blue('> webpack bundle is start.'))
        }
        if (percentage === 1) {
          buildTime.end = new Date().getTime()
          console.log(chalk.blue('> webpack bundle is finished. (Spent %s ms)'), buildTime.end - buildTime.start)
        }
      }),
      new webpack.NoEmitOnErrorsPlugin()
    ]
  };
}
