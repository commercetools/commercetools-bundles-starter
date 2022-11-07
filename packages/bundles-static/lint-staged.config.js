module.exports = {
  '*.js': [
    'yarn lint:js --reporters=jest-silent-reporter --onlyChanged',
    'yarn format:js',
  ], // TODO: test
  '*.css': [
    'yarn lint:css -- --reporters=jest-silent-reporter --onlyChanged',
    'yarn format:css',
  ],
  '*.graphql': [
    'yarn lint:graphql --reporters=jest-silent-reporter --onlyChanged',
    'yarn format:graphql',
  ],
};
