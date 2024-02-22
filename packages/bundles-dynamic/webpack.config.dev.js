const path = require('path');
const {
  createWebpackConfigForDevelopment,
} = require('@commercetools-frontend/mc-scripts/webpack');

const config = createWebpackConfigForDevelopment();

config.module.rules.push({
  test: /\.graphql$/,
  loader: 'graphql-tag/loader',
  exclude: [/node_modules\/(?!@commercetools-us-ps\/bundles-core)/, /src/], // Exclude node_modules except @commercetools-us-ps\/bundles-core
});

// TODO: add loader for jsx
config.module.rules.push({
  test: /\.(js|jsx)$/,
  exclude: [/node_modules\/(?!@commercetools-us-ps\/bundles-core)/, /src/], // Exclude node_modules except @commercetools-us-ps\/bundles-core
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
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        // Enable CSS Modules
        modules: true,
      },
    },
  ],
  exclude: [/node_modules\/(?!@commercetools-us-ps\/bundles-core)/, /src/], // Exclude node_modules except @commercetools-us-ps\/bundles-core
});

module.exports = config;
