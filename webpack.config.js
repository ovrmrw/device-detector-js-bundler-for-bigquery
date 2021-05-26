const path = require('path');

const name = 'device-detector-js';

const dependencies = require('./package-lock.json').dependencies;
const version = (dependencies[name] || {}).version || '';

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `${name}_${version}.js`,
  },
  target: 'web',
};
