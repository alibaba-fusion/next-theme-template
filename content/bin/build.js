'use strict'

const path = require('path');
const rmdir = require('rimraf');
const webpack = require('webpack');
const fs = require('fs');
const co = require('co');

const BASE_DIR = path.dirname(__dirname);

const config = require('../webpack.config.js');
const distPath = path.join(process.cwd(), 'dist');

function build(minimize = false) {
  return new Promise((resolve, reject) => {
    webpack(config({minimize})).run((err, stats) => {
      if (err) {
        reject(err);
      } else {
        const errors = stats.toJson().errors;
        if (errors.length) {
          reject(stats.toString({
            chunkModules: false,
          }));
        } else {
          resolve(stats);
        }
      }
    });
  });
}

co(function*() {
  // build
  console.log('# build');
  yield build();
  console.log('# build minimize');
  yield build(true);

  // remove bin dir
  console.log('# remove bin dir');
  rmdir.sync(path.join(BASE_DIR, 'webpack.config.js'));
  rmdir.sync(path.join(BASE_DIR, 'bin'));

  try {
    fs.unlinkSync(path.join(distPath, 'next-noreset.min.js'));
    fs.unlinkSync(path.join(distPath, 'next-noreset.js'));
  } catch(e) {
    console.log('remove next-noreset.js or next-noreset.min.js failed: ', e);
  }

}).catch(err => {
  console.error(err.stack || err);
  process.exit(1);
})
