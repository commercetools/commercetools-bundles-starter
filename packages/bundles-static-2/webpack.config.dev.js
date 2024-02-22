const path = require('path');
const {
  createWebpackConfigForDevelopment,
} = require('@commercetools-frontend/mc-scripts/webpack');

const config = createWebpackConfigForDevelopment();

config.resolve = {
  ...config.resolve,
  alias: {
    ...config.resolve.alias,
    '@bundles-core': path.resolve(__dirname, 'src/bundles-core/'),
  },
};

module.exports = config;
