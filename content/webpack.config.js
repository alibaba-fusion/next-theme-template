'use strict';

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CssSplitWebpackPlugin = require('css-split-webpack-plugin').default;
const chalk = require('chalk');
const babelConfig = require('@alifd/babel-preset-next')({}, { runtime: true });
const autoprefixer = require('autoprefixer');

const css = (options = {}) => [{
  loader: 'style-loader'
}, {
  loader: 'css-loader',
  options: {
    minimize: !!options.minimize
  }
}, {
  loader: 'postcss-loader',
  options: {
    plugins: () => [autoprefixer({
      browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 9']
    })]
  }
}];

const scss = (options = {}) => [
  ...css(options), {
    loader: 'fast-sass-loader'
  }
];

const buildTime = {
  start: new Date().getTime(),
  end: new Date().getTime()
};

const depName = '{{library.name}}';
const depPureName = depName.split('/').slice(-1);

module.exports = function ({minimize = false}) {
  const cwd = process.cwd();

  const config = {
    entry: {
      [depPureName]: ['./index.js', './index.scss'],
      [`${depPureName}-noreset`]: './index-noreset.scss'
    },
    output: {
      path: path.join(cwd, 'dist'),
      publicPath: '/dist/',
      library: depPureName,
      libraryTarget: 'umd'
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    externals: [
      {
        'react': {
          root: 'React',
          commonjs2: 'react',
          commonjs: 'react',
          amd: 'react'
        }
      }, {
        'react-dom': {
          root: 'ReactDOM',
          commonjs2: 'react-dom',
          commonjs: 'react-dom',
          amd: 'react-dom'
        }
      }, {
        'moment': {
          root: 'moment',
          commonjs2: 'moment',
          commonjs: 'moment',
          amd: 'moment'
        }
      }
    ],
    module: {
      rules: [{
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: Object.assign({
            cacheDirectory: true,
          }, babelConfig)
        },
        exclude: /node_modules/,
      }, {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: css({ minimize }).slice(1)
        })
      }, {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: scss({ minimize }).slice(1)
        })
      }]
    },
    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new CaseSensitivePathsPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"'
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.ProgressPlugin((percentage, msg) => {
        if (percentage === 0) {
          buildTime.start = new Date().getTime();
          console.log(chalk.blue('> webpack bundle is start.'));
        }
        if (percentage === 1) {
          buildTime.end = new Date().getTime();
          console.log(chalk.blue('> webpack bundle is finished. (Spent %s ms)'), buildTime.end - buildTime.start);
        }
      })
    ]
  };

  if (minimize){
    config.output.filename = '[name].min.js';
    config.plugins.push(
      new ExtractTextPlugin({
        filename: '[name].min.css',
        allChunks: true
      }),
      new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        compress: {
          warnings: false
        },
        output: {
          comments: false,
          ascii_only: true
        }
      })
    );
  } else {
    config.output.filename = '[name].js';
    config.plugins.push(
      new ExtractTextPlugin({
        filename: '[name].css',
        allChunks: true
      })
    );
  }

  config.plugins.push(
    new CssSplitWebpackPlugin({size: 4000, preserve: true})
  );

  return config;
};
