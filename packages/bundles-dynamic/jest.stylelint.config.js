module.exports = {
  runner: 'jest-runner-stylelint',
  displayName: 'stylelint',
  moduleFileExtensions: ['css'],
  modulePathIgnorePatterns: ['dist', 'packages-from-mc', 'coverage'],
  testMatch: ['<rootDir>/**/*.css'],
  watchPlugins: ['jest-plugin-filename'],
};
