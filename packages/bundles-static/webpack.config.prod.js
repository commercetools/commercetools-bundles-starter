const path = require('path');
const {
  createWebpackConfigForProduction,
} = require('@commercetools-frontend/mc-scripts/webpack');

const sourceFolders = [
  path.resolve(__dirname, 'src'),
  path.resolve(__dirname, '../core'),
  path.resolve(__dirname, '../bundles-core'),
];

module.exports = createWebpackConfigForProduction({
  sourceFolders,
});
