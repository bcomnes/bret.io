# [bret.io](https://www.bret.io)

[![Actions Status](https://github.com/bcomnes/bret.io/workflows/tests/badge.svg)](https://github.com/bcomnes/bret.io/actions)
![Deploy to neociteis](https://github.com/bcomnes/bret.io/workflows/Deploy%20to%20neociteis/badge.svg)

Source code for [bret.io](https://www.bret.io).

```sh
npm i
npm test
npm start # live reload server for dev
npm run build # build snapshot from src to public
```

## Features

- Markdown to HTML with [sitedown](https://github.com/hypermodules/sitedown)
- [Modular](https://github.com/bcomnes/bret.io/blob/master/postcss.config.js#L5-L10) CSS in-lining with [post-css](https://github.com/postcss/postcss)
- Modular JS with [browserify](http://browserify.org) tested with [tape](https://github.com/substack/tape)
- CSS base coat provided by: [style.css](https://github.com/ungoldman/style.css), [top-bar.css](https://github.com/ungoldman/top-bar.css), [Go fonts](https://blog.golang.org/go-fonts) [👨‍🎨](https://ungoldman.com)
- Automated dependency updates by [greenkeeper](https://greenkeeper.io)
- Full external CSS + JS sourcemap support
- Progressive enhancement on top of Github's build in repo browser (essentially, Github as a CMS). Browse around in [src](/src)

## Screenshot

(may be out of date)

![screenshot](screenshot.png)

## License

- Content: © Bret Comnes
- Code: ISC
