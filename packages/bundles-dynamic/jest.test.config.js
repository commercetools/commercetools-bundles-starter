module.exports = {
  preset: '@commercetools-frontend/jest-preset-mc-app',
  moduleDirectories: ['src', 'node_modules'],
  transformIgnorePatterns: [
    '/node_modules/(?!intl-messageformat|intl-messageformat-parser).+\\.js$'
  ]
};
