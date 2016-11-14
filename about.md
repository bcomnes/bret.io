# About

[![Build Status](https://travis-ci.org/bcomnes/bret.io.svg?branch=master)](https://travis-ci.org/bcomnes/bret.io)
[![devDependencies Status](https://david-dm.org/bcomnes/bret.io/dev-status.svg)](https://david-dm.org/bcomnes/bret.io?type=dev)

This is a simple professional website that is generated using [ungoldman/sitedown](https://github.com/ungoldman/sitedown) for commonmark transforms, [postcss](https://github.com/postcss/postcss) for css transforms and asset importing, [budo](https://github.com/mattdesl/budo) for live-reload and rapid development, and [browserify](http://browserify.org) for js bundling.

Thanks to [ungoldman/style.css](https://github.com/ungoldman/style.css) for a hassle free markdown base style.

```json
{
  "name": "bret.io",
  "version": "1.0.0",
  "description": "profesh website",
  "main": "src/index.js",
  "scripts": {
    "test": "run-s test:* build",
    "test:deps": "dependency-check .",
    "test:lint": "standard | snazzy",
    "test:tape": "tape test/* | tap-format-spec",
    "gh-pages": "npm run build && gh-pages -d dist",
    "build": "npm run clean && run-p build:*",
    "build:css": "postcss -c postcss.config.js",
    "build:js": "browserify src/index.js -o dist/bundle.js",
    "build:md": "sitedown . -b dist -l src/layout.html",
    "build:cname": "cpr CNAME dist/CNAME",
    "watch": "npm run clean && run-p watch:*",
    "watch:css": "npm run build:css -- --watch",
    "watch:js": "budo src/index.js:bundle.js --dir dist --live --open",
    "watch:md": "npm run build:md -- -w",
    "clean": "rimraf dist && mkdirp dist",
    "start": "npm run watch"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/bcomnes/bret.io.git"
  },
  "keywords": [
    "website",
    "bret",
    "comnes"
  ],
  "author": "Bret Comnes",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/bcomnes/bret.io/issues"
  },
  "homepage": "https://github.com/bcomnes/bret.io#readme",
  "devDependencies": {
    "@tap-format/spec": "^0.2.0",
    "autoprefixer": "^6.5.2",
    "browserify": "^13.1.1",
    "budo": "^9.2.1",
    "cpr": "^2.0.0",
    "dependency-check": "^2.6.0",
    "font-awesome": "^4.7.0",
    "gh-pages": "^0.11.0",
    "highlight.js": "^9.8.0",
    "mkdirp": "^0.5.1",
    "npm-run-all": "^3.1.1",
    "postcss": "^5.2.5",
    "postcss-browser-reporter": "^0.5.0",
    "postcss-cli": "^2.6.0",
    "postcss-import": "^8.2.0",
    "postcss-reporter": "^2.0.0",
    "postcss-url": "^5.1.2",
    "rimraf": "^2.5.4",
    "sitedown": "^3.0.1",
    "snazzy": "^5.0.0",
    "standard": "^8.5.0",
    "style.css": "^1.0.0-alpha-8",
    "tape": "^4.6.2",
    "top-bar.css": "^1.2.0",
    "watchify": "^3.7.0"
  },
  "dependencies": {}
}
```
