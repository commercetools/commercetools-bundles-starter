module.exports = {
  runner: 'jest-runner-stylelint',
  displayName: 'stylelint',
  moduleFileExtensions: ['css'],
  modulePathIgnorePatterns: ['dist', 'coverage'],
  testMatch: ['<rootDir>/**/*.css'],
  watchPlugins: ['jest-plugin-filename'],
};
