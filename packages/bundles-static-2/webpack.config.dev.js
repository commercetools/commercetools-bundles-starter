const path = require('path');
const {
  createWebpackConfigForDevelopment,
} = require('@commercetools-frontend/mc-scripts/webpack');

const config = createWebpackConfigForDevelopment();

config.resolve = {
  ...config.resolve,
  alias: {
    ...config.resolve.alias,
    '@bundles-core': path.resolve(__dirname, '../bundles-core-2/'),
  },
};


config.module.rules.push({
  test: /\.graphql$/,
  loader: 'graphql-tag/loader',
  include: path.resolve(__dirname, '../bundles-core-2'),
});

// TODO: add loader for jsx
config.module.rules.push({
  test: /\.(js|jsx)$/,
  include: path.resolve(__dirname, '../bundles-core-2'),
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env', '@babel/preset-react'],
    },
  },
});

config.module.rules.push({
  test: /\.css$/,
  use: [
    // For production, replace 'style-loader' with MiniCssExtractPlugin.loader
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        // Enable CSS Modules
        modules: true,
      },
    },
  ],  include: path.resolve(__dirname, '../bundles-core-2'),
});

module.exports = config;
