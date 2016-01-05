require('babel-register')({
  presets: ["es2015"]
});

module.exports = require('./webpack.config')({
  production: true
});
