'use strict';

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
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
      extensions: ['*', '.js', '.vue', '.json', '.md', '.scss', '.css'],
      alias: {
        'vue': 'vue/dist/vue.esm.js'
      }
    },
    externals: [{
      'vue': {
        root: 'Vue',
        commonjs: 'vue',
        commonjs2: 'vue',
        amd: 'vue'
      }
    }],
    module: {
      rules: [{
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          transformToRequire: {
            video: 'src',
            source: 'src',
            img: 'src',
            image: 'xlink:href'
          }
        }
      }, {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: [require('babel-preset-env')]
        }
      }, {
        test: /\.s?css$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'sass-loader'],
          fallback: 'style-loader'
        })
      }]
    },
    plugins: [
      new webpack.LoaderOptionsPlugin({
        minimize: true
      }),
      new VueLoaderPlugin(),
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
