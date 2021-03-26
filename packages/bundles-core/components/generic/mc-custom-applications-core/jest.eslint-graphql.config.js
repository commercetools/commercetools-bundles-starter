module.exports = {
  runner: 'jest-runner-eslint',
  displayName: 'eslint',
  modulePathIgnorePatterns: ['dist', 'coverage'],
  testPathIgnorePatterns: ['schema.graphql'],
  moduleFileExtensions: ['graphql'],
  testMatch: ['<rootDir>/**/*.graphql'],
  watchPlugins: ['jest-plugin-filename'],
};
