const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/main.ts',
  mode: 'production',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
        { from: './index.html' },
        { from: './style.css' },
        { from: './data', to: './data' },
        { from: './node_modules/three/build/three.min.js', to: './scripts' }
    ])
  ],
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  externals: {
    three: 'THREE',
  },
  output: {
    filename: 'scripts/boardhouse.bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
}