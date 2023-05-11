module.exports = {
  runner: 'jest-runner-eslint',
  displayName: 'eslint',
  modulePathIgnorePatterns: ['dist', 'packages-from-mc', 'coverage', 'public'],
  moduleFileExtensions: ['js'],
  testMatch: ['<rootDir>/**/*.js'],
  watchPlugins: ['jest-watch-typeahead/filename'],
};
