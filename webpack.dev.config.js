const webpack = require('webpack');

module.exports = {
  entry: {
      app: __dirname + "/src/app.js",
      measurement: __dirname + "/src/measurement.js",
      iconClicked: __dirname + "/src/iconClicked.js"
  },
  output: {
      path: __dirname + "/dist",
      filename: "[name].js"
  },
  devtool: 'inline-source-map',
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    },
    extensions: [ ".js" ]
  },
  module: {
      loaders: [
          { exclude: /node_modules/ }
      ]
  },
  plugins: []
};