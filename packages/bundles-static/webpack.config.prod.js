const path = require('path');
const webpack = require('@commercetools-frontend/mc-scripts/webpack');

const distPath = path.resolve(__dirname, 'dist');
const entryPoint = path.resolve(__dirname, 'src/index.js');
const sourceFolders = [
  path.resolve(__dirname, 'src'),
  path.resolve(__dirname, '../core'),
  path.resolve(__dirname, '../bundles-core'),
];

module.exports = webpack.createWebpackConfigForProduction({
  distPath,
  entryPoint,
  sourceFolders,
});
