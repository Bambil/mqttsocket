const path = require('path');

module.exports = {
  entry: './lib/',
  output: {
    filename: 'mqttsocket.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  devtool: "source-map"
};
