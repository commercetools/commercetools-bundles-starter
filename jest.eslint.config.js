module.exports = {
  runner: 'jest-runner-eslint',
  displayName: 'eslint',
  modulePathIgnorePatterns: ['dist', 'packages-from-mc', 'coverage'],
  moduleFileExtensions: ['js'],
  testMatch: ['<rootDir>/**/*.js'],
  watchPlugins: ['jest-plugin-filename']
};
