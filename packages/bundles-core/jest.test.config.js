module.exports = {
  preset: '@commercetools-frontend/jest-preset-mc-app',
  transformIgnorePatterns: [
    '/node_modules/(?!intl-messageformat|intl-messageformat-parser).+\\.js$'
  ]
};
