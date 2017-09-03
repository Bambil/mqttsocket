const path = require('path');

module.exports = {
  entry: [
    'babel-polyfill',
    './lib/'
  ],
  output: {
    filename: 'mqttsocket.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015'],
              plugins:[
                'transform-runtime'
              ],
            }
          }
        ]
      }
    ]
  },
  devtool: 'source-map'
};
