const path = require('path');

module.exports = {
  entry: './lib/client.js',
  output: {
    filename: 'mqttsocket.js',
    path: path.resolve(__dirname, 'dist')
  }
};
