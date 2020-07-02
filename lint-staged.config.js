module.exports = {
  '*.js': [
    'yarn lint:js --reporters=jest-silent-reporter --onlyChanged',
    'yarn format:js',
    'git add'
  ],
  '*.css': [
    'yarn lint:css -- --reporters=jest-silent-reporter --onlyChanged',
    'yarn format:css',
    'git add'
  ],
  '*.graphql': [
    'yarn lint:graphql --reporters=jest-silent-reporter --onlyChanged',
    'yarn format:graphql',
    'git add'
  ]
};
