module.exports = {
  runner: 'jest-runner-eslint',
  displayName: 'eslint',
  modulePathIgnorePatterns: ['dist', 'packages-from-mc', 'coverage', 'public'],
  testPathIgnorePatterns: ['schema.graphql'],
  moduleFileExtensions: ['graphql'],
  testMatch: ['<rootDir>/**/*.graphql'],
  watchPlugins: ['jest-watch-typeahead/filename'],
};
