const path = require('node:path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  target: 'web',
  devtool: false,
  entry: {
    index: './gas-tracker-frontend/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'gas-tracker-frontend-dist'),
    filename: 'gas-data-lib.js',
    library: 'GasDataLib',
    libraryTarget: 'umd',
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {from: 'gas-tracker-frontend/index.html', to: 'index.html'},
        {from: 'gas-tracker-frontend/gascan.png', to: 'gascan.png'}
      ],
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts'],
  },
  module: {
    rules: [
      { test: /\.ts/, loader: 'ts-loader'}
    ]
  }
}
