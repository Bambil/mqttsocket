const path = require('path');

module.exports = {
  entry: './lib/index.js',
  output: {
    filename: 'mqttsocket.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};
