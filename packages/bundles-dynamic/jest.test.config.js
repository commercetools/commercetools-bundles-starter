const jestPreset = require('@commercetools-frontend/jest-preset-mc-app');
const applyJestPresetWithEnzyme = require('@commercetools-frontend/jest-preset-mc-app/enzyme/apply-jest-preset-with-enzyme');

module.exports = {
  ...applyJestPresetWithEnzyme({
    enzymeAdapterVersion: 17,
    jestPreset,
  }),
  moduleDirectories: ['src', 'node_modules'],
  transformIgnorePatterns: [
    '/node_modules/(?!intl-messageformat|intl-messageformat-parser).+\\.js$',
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/components/**/*.{js,jsx}',
    '!src/components/**/{index,constants,messages}.js',
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      statements: 82,
    },
  },
};
