module.exports = {
  runner: 'jest-runner-stylelint',
  displayName: 'stylelint',
  moduleFileExtensions: ['css'],
  modulePathIgnorePatterns: ['dist', 'packages-from-mc', 'coverage', 'public'],
  testMatch: ['<rootDir>/**/*.css'],
  watchPlugins: ['jest-watch-typeahead/filename'],
};
