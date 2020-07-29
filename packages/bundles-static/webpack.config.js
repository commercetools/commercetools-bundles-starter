const path = require('path');
const Dotenv = require('dotenv-webpack');

const mode = process.env.NODE_ENV || 'development';
const safe = process.env.CI ? false : './config/example.env';

module.exports = {
  mode,
  entry: ['./src/index.js'],
  target: 'node',
  plugins: [
    new Dotenv({
      safe,
      path: `./config/${mode}.env`,
      defaults: './config/default.env',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, 'dist/'),
    filename: 'index.js',
  },
};
