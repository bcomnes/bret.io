var path = require('path')
var mkdirp = require('mkdirp')
var url = require('url')

module.exports = {
  use: [
    'postcss-import',
    'postcss-url',
    'postcss-browser-reporter',
    'postcss-reporter'
  ],
  input: './src/index.css',
  output: path.join(__dirname, 'dist/bundle.css'),
  'postcss-url': {
    url: 'copy',
    useHash: true,
    assetsPath: 'assets'
  }
}
