const path = require('path');

module.exports = {
  entry: './lib/',
  output: {
    filename: 'mqttsocket.js',
    path: path.resolve(__dirname, 'dist')
  }
};
