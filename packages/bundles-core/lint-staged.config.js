module.exports = {
  '*.js': [
    'yarn lint:js --reporters=jest-silent-reporter --onlyChanged',
    'yarn format:js',
  ],
  '*.css': [
    'yarn lint:css -- --reporters=jest-silent-reporter --onlyChanged',
    'yarn format:css',
  ],
};
