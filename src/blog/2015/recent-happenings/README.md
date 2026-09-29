---
layout: article
title: "September Projects Update"
publishDate: "2015-09-15"
legacyDate: "2015-09-15 19:35"
handlebars: false
redirectFrom:
  - "/2015/09/15/recent-happenings/"
---

> **Archived post — originally published 2015-09-15.**
>
> **Historical context:** This post describes the 2015 Node/io.js ecosystem. Six original Flickr illustrations are unavailable.

It's been a while since an update so here are some recent happenings:

## [node-learnbook](https://github.com/bcomnes/node-learnbook)

<figure>
  <p><strong>Image unavailable.</strong> <a href="https://farm1.staticflickr.com/568/20833555994_7da961145b_o.png">Original image URL</a> · <a href="https://github.com/bcomnes/node-learnbook">Original linked page</a></p>
  <figcaption>Original illustration; no caption supplied.</figcaption>
</figure>

There are a million resources available to learn JS.  JS as a language is still used and developed in so many different ways.  Node flavored JS is an excellent subset of JS, HTML and CSS to learn and is a joy to work with, but it isn't clear what the best slice of material is to focus on when you are wading your way through all of them, especially if JS is your very first language.

[node-learnbook](https://github.com/bcomnes/node-learnbook) is my attempt to capture and promote my favorite resources for materials that teach and discuss how to write node flavored JS.

Still a work in progress, but I am happy with positive feedback I have received on it so far.

Writing large [GHF markdown](https://help.github.com/articles/github-flavored-markdown/) documents straight into a github repository has been an absolute joy as well.

## [Goref](https://github.com/bcomnes/goref)

<figure>
  <p><strong>Image unavailable.</strong> <a href="https://farm1.staticflickr.com/641/20835149643_445d9a0df9_o.png">Original image URL</a> · <a href="https://github.com/bcomnes/goref">Original linked page</a></p>
  <figcaption>Original illustration; no caption supplied.</figcaption>
</figure>

[Go](https://golang.org/) is groovy small language that seems to be producing high quality and performant network applications like [ipfs](http://ipfs.io/).  It's is typed and has some weird sharp edges when it comes to its syntax, but once you catch it's flow, its as lightweight as writing ES5 JS.  Oh and it compiles to binaries and has a [super simple toolchain](https://golang.org/doc/code.html) with a built in style linter and formatter ([gofmt](https://golang.org/cmd/gofmt/)).

[Goref](https://github.com/bcomnes/goref) is simmered down version of a few resources designed to be a quick language reference.  Still a WIP, but it has a lot there already.

## Standard Happenings

<figure>
  <p><strong>Image unavailable.</strong> <a href="https://farm1.staticflickr.com/769/21445284342_2b6419d557_o.png">Original image URL</a> · <a href="http://standardjs.com/">Original linked page</a></p>
  <figcaption>Original illustration; no caption supplied.</figcaption>
</figure>

The standard linter and its family of tools has been growing rapidly.  My focus has been on improving [`maxogden/standard-format`](https://github.com/maxogden/standard-format) with as little time as I have for it.  Big thanks to [@feross](http://feross.org/) for sailing that ship.

[Sublime-StandardFormat](https://packagecontrol.io/packages/StandardFormat) has been chugging along and been working quite well in its day to day use.  There are some cool updates that will make it integrate even better with [project level `package.json` integration](https://github.com/bcomnes/sublime-standard-format/issues/30).

[@flet](https://twitter.com/flettre) has put in a bunch of work into the website, online linter and general maintenance of the project as well.

## Small tools for writing small modules

Never really got the word out about these much, but I helped out on a few projects with [@ngoldman](http://ngoldman.me/) on two super helpful utilities.  They even got a shout out on [@ogd's super handy module list](https://github.com/maxogden/maintenance-modules).

#### [`gh-release`](https://github.com/ngoldman/gh-release)

<figure>
  <a href="https://github.com/ngoldman/gh-release"><img src="./demo-still.png" width="564" height="307" alt="Terminal demonstration of gh-release" loading="lazy"></a>
  <figcaption><a href="./demo.webp">View animated demo (WebP)</a> — motion is opt-in.</figcaption>
</figure>

A small tool that helps you properly create releases on github and npm while [[keeping a changelog](http://keepachangelog.com/).  There are a million little steps and its easy to screw up.  `gh-release` automates the pain away, or at least lets you know when you are going to make a mistake.

#### [`module-init`](https://github.com/ngoldman/module-init)

<figure>
  <p><strong>Image unavailable.</strong> <a href="https://farm1.staticflickr.com/781/21456244825_b46a82c796_o.png">Original image URL</a> · <a href="https://github.com/ngoldman/module-init">Original linked page</a></p>
  <figcaption>Original illustration; no caption supplied.</figcaption>
</figure>

[Boilerplate sucks](http://nodejsreactions.tumblr.com/post/71214841806/you-know-theres-a-yeoman-generator-for-that), and even when you eliminate most of it, setting up your badges, ci, readmes and changelogs, there is a a lot of boilerplate!  `module-init` creates a new module with all the right stuff.   Super handy for banging out lots of little modules with all the right stuff.

On a similar note, [`bcomnes/changelog-init`](https://github.com/bcomnes/changelog-init) was also born out of this effort, although it still remains separate from `module-init`.  Trying to find the right balance of modularity and purpose is hard.

<figure>
  <a href="https://github.com/bcomnes/changelog-init"><img src="./changelog-init-still.png" width="672" height="459" alt="Terminal demonstration of changelog-init" loading="lazy"></a>
  <figcaption><a href="./changelog-init.webp">View animated demo (WebP)</a> — motion is opt-in.</figcaption>
</figure>

## [twitter-video](https://github.com/bcomnes/twitter-video)

<figure>
  <p><strong>Image unavailable.</strong> <a href="https://farm6.staticflickr.com/5656/21269345749_f9943f16a6_o.png">Original image URL</a> · <a href="https://twitter.com/bretolius/status/636763594219130880">Original linked page</a></p>
  <figcaption>Original illustration; no caption supplied.</figcaption>
</figure>

Twitter introduced some sweet native video capabilities a while back, but it was only accessible via the API.  The API requires some pretty tricky multi-part requests, and nobody seemed to have had implemented it a few months ago.

The results of this effort is the [`twitter-video`](https://github.com/bcomnes/twitter-video) module.

This module utilizes asynchronously assigned writable streams using [duplexify](https://github.com/mafintosh/duplexify) and [through2](https://github.com/rvagg/through2) (which not surprisingly is now using [streams v3](https://nodejs.org/api/stream.html) :rolleyes:), providing an interesting way to accommodate tricky stream connection details quite easily.

Respek to [@jbulva](https://twitter.com/jbulava) and [@thoward37](https://twitter.com/thoward37/) for listening to me complain about the API *ahem* I mean for being super receptive with feedback ;)

This module also pairs [cliclopts](https://github.com/finnp/cliclopts) and [minimist](https://www.npmjs.com/package/minimist) together which results in an amazingly great CLI parsing and documentation API.  Highly recommended.

<figure>
  <a href="https://github.com/finnp/cliclopts"><img src="./cliclopts.png" width="200" height="151" alt="Cartoon Viking mascot holding a spear and shield" loading="lazy"></a>
</figure>

## iojs never graduates the cellar

<figure>
  <p><strong>Image unavailable.</strong> <a href="https://farm1.staticflickr.com/675/21430268116_51268ef9d0_o.png">Original image URL</a> · <a href="https://github.com/Homebrew/homebrew/pull/36369">Original linked page</a></p>
  <figcaption>Original illustration; no caption supplied.</figcaption>
</figure>

The [attempt to get a working-by-default](https://github.com/Homebrew/homebrew/pull/36369) formula for iojs never happened.  Thats okay because iojs + node 0.12 is now [node 4.0.0](https://medium.com/node-js-javascript/4-0-is-the-new-1-0-386597a3436d) and we had great alternatives the entire time everyone has been waiting (either through the tap, force linking cellar only iojs, both paired with [pangyp](https://www.npmjs.com/package/pangyp) or of course nvm).

There are a few floating patches open till next week, so until we can [land the update into the main formula](https://github.com/Homebrew/homebrew/pull/43973), use [aredridel/homebrew-iojs](https://github.com/aredridel/homebrew-iojs) which has a `node-alt` formula now.

Thanks to everyone involved who provided their thoughts, advice, and diligent work keeping pace with the iojs/node merge.

### Historical syndication

- [Twitter](https://twitter.com/bretolius/status/644005231018164224m)
