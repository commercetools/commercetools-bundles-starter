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
  ]
};
