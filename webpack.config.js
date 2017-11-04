const webpack = require('webpack');

module.exports = {
  entry: {
      app: __dirname + "/src/app.js",
      measurement: __dirname + "/src/app.js",
      iconClicked: __dirname + "/src/iconClicked.js"
  },
  output: {
      path: __dirname + "/dist",
      filename: "[name].js"
  },
  resolve: {
      extensions: [ ".js" ]
  },
  module: {
      loaders: [
          { exclude: /node_modules/ }
      ]
  },
  plugins: []
};