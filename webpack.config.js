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