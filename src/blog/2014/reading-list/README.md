---
layout: "article"
title: "December Reading List"
publishDate: "2014-12-09"
legacyDate: "2014-12-09 12:34"
handlebars: false
redirectFrom: ["/2014/12/09/reading-list/"]
---

> **Archived post — originally dated 2014-12-09.**
>
> **Historical context:** This list reflects December 2014 book editions, tooling, and io.js news. The Streams, Tape, io.js, and Hexbin illustrations are unavailable. The other images may differ from their 2014 versions.

Catching up on a bunch of stuff by [`substack`](http://substack.net) and [`ogd`](http://maxogden.com/node-packaged-modules.html) and learning some things when developing [tempy](https://tempy.herokuapp.com), plus a few other tangents.

## Browserify all the things!

<figure>
<img src="./browserify.webp" alt="Browserify logo">
<figcaption>Browserify logo</figcaption>
</figure>

- [Browserify-handbook](https://github.com/substack/browserify-handbook) - Read all of it!

  Browserify didn't really make sense until I was able to understand `require`.

  > People used to think that exporting a bunch of handy utility-style things would be the main way that programmers would consume code because that is the primary way of exporting and importing code on most other platforms and indeed still persists even on npm.

- [Rails is omakase](http://david.heinemeierhansson.com/2012/rails-is-omakase.html) - More on why small modules are nice.

- [Node Packaged Modules](http://maxogden.com/node-packaged-modules.html) A nice dose of sanity to the insanity that is front-end JS library management.

  > There is only one problem: browsers don't have a good way to load modules. The state of the art is to have a ton of script tags that either leak globals e.g. how jQuery plugins all use $ or use RequireJS to manage loading code into the correct scopes.

- [ES6 Modules: The End of Civilization As We Know It?](https://medium.com/@brianleroux/es6-modules-amd-and-commonjs-c1acefbe6fc0) - [dlmanning](https://twitter.com/davidlymanning) pointed this article out regarding the future of module loading.  Excellent read.
  - [ES6 Cheatsheet](http://espadrine.github.io/New-In-A-Spec/es6/)

- [Browserify-middlware](https://github.com/ForbesLindesay/browserify-middleware) - A connect style middleware for generating your browserified bundles.
- [wzrd.in](http://wzrd.in) - CDN for common.js packages.
- [multi-shim-example-including-dependencies](https://github.com/thlorenz/browserify-shim#multi-shim-example-including-dependencies) - Adapting global JS libs for browserify.

## Streams and Promises

[Streams Handbook illustration link](https://github.com/substack/stream-handbook) — *Original illustration unavailable.* [Original image reference](https://farm8.staticflickr.com/7526/15363324924_35e7ec5490_z.jpg)

- [Streams Handbook](https://github.com/substack/stream-handbook)

  > Streams can help to separate your concerns because they restrict the implementation surface area into a consistent interface that can be reused.

  Streams have always been more confusing than callbacks, and after reading this, they are much easier to understand.  That being said, its concerning to see how different APIs are of the various stream versions.

- Speaking of streams, promises seem weirder the more I hear about them:

  > 23:51:54  &lt;rvagg&gt; Promises are a huge pollution to interoperability, an abstraction on top of an abstraction

  >  23:52:51  &lt;rvagg&gt; Domenic: they are an hack on top of synchronous languages that haven't grown up with first-class functions and they are an uncomfortable fit in JS because of this

  >  23:53:18  &lt;rvagg&gt; they allow you to defer your learning of what &quot;asynchronous programing&quot; means, further delaying your ability to write more performance and parallel code

  >  23:54:44  &lt;rvagg&gt; callbacks are the very definition of a representation of &quot;stuff that happens in the background&quot;, we have that mechanism already

  >  23:55:23  &lt;rvagg&gt; helping people adapt to full CPS is a more worthy goal than allowing them to defer that for even longer (and they do have to get there in the end no matter what route they take)
  > <small><a href="http://r.va.gg">rvagg</a> on <a href="http://logs.libuv.org/io.js/2014-12-08"><cite title="#io.js">#io.js</cite></a></small>

- [node aesthetic](http://substack.net/node_aesthetic)
- [many things](http://substack.net/many_things)

## Testing and Tasking

- [Tape](https://github.com/substack/tape)

  *Tape drive illustration unavailable.* [Original image reference](https://camo.githubusercontent.com/50dd49050de38c87a28ab6aa0b09bbe2d042cba1/687474703a2f2f737562737461636b2e6e65742f696d616765732f746170655f64726976652e706e67)

  Converted all tests to use tape.  Testing becomes much simpler when you don't have a magical framework doing things for you.  Mocha be gone!  At least the workings of mocha is clear too.

- [How substack writes tests](http://substack.net/how_I_write_tests_for_node_and_the_browser)
- [Guide to browser tape testing](https://ci.testling.com/guide/tape)
- Paired with [tape-spec](https://github.com/brianleroux/browserify-tape-spec)
- [How to Use npm as a Build Tool](http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/) - instead of make, gulp, grunt.

## io.js/node stuff

*io.js Jupiter artwork unavailable.* [Original image reference](https://camo.githubusercontent.com/69bd3dda2e9fede2616dfc0a5eb64dda529e3976/687474703a2f2f736372617463682e737562737461636b2e6e65742f696f6a735f6a7570697465722e737667)

Node.js is forked.  Here is all that you need to know.

- [blog.izs.me: io.js](http://blog.izs.me/post/104685388058/io-js)
- [maxogden / readme.md](https://gist.github.com/maxogden/d96123138522c84cdb25) - on io.js
- [All the Logos](http://tableflip.io:1234)
- [And the corresponding issue](https://github.com/iojs/io.js/issues/37)

## Misc

- [Raynos/http-framework](https://github.com/Raynos/http-framework)

  In line with only using NPM as your task runner, but only using basic modules as an http server.

- [bounce http requests with bouncy](http://substack.net/bounce_http_requests_with_bouncy)

- [Hexbin.io](http://hexb.in) - Yay hex stickers
  *Hexbin illustration unavailable.* [Original image reference](http://hexb.in/assets/nav.png)

- [Node.js Hackday: Building a federated architecture by James Haliday](https://www.youtube.com/watch?v=84PE6EF3YWY&list=FLd8cLeIEVcsbhyX9FDph-Jg&index=3)

  <figure>
  <div class="flex-video"><iframe title="Node.js Hackday: Building a federated architecture by James Haliday" loading="lazy" src="https://www.youtube-nocookie.com/embed/84PE6EF3YWY" allowfullscreen></iframe></div>
  <figcaption>Node.js Hackday: Building a federated architecture by James Haliday</figcaption>
  </figure>

  Covered in this video:

  - [Dnode](https://github.com/substack/dnode)
  - [Upnode](https://github.com/substack/upnode)
  - [Fleet](https://github.com/substack/fleet)
  - [seaport](https://github.com/substack/seaport)

  Blog posts about these tools:

  - [multi-server continuous deployment with fleet](http://substack.net/multi_server_continuous_deployment_with_fleet)
  - [semver your services with seaport](http://substack.net/semver_your_services_with_seaport)

- [shared rendering in node and the browser](http://substack.net/shared_rendering_in_node_and_the_browser) - Template DSL languages are annoying and the HTML only ones are usually no better.

## Books

*Want / reading / read:*

<figure>
<a href="http://twoscoopspress.org/collections/everything/products/two-scoops-of-django-1-6"><img src="./two-scoops-of-django-1-6.webp" alt="Two Scoops of Django 1.6 book cover"></a>
<figcaption><a href="http://twoscoopspress.org/collections/everything/products/two-scoops-of-django-1-6">Two Scoops of Django 1.6</a></figcaption>
</figure>

<figure>
<a href="http://eloquentruby.com"><img src="./eloquent-ruby.webp" alt="Eloquent Ruby book cover"></a>
<figcaption><a href="http://eloquentruby.com">Eloquent Ruby</a></figcaption>
</figure>

<figure>
<a href="http://www.effectivepython.com"><img src="./effective-python.webp" alt="Effective Python book cover"></a>
<figcaption><a href="http://www.effectivepython.com">Effective Python</a> — Congrats <a href="http://www.onebigfluke.com">Brett Slatkin</a>!</figcaption>
</figure>

<figure>
<a href="http://effectivejs.com"><img src="./effective-javascript.webp" alt="Effective JavaScript book cover"></a>
<figcaption><a href="http://effectivejs.com">Effective Javascript</a></figcaption>
</figure>

<figure>
<a href="http://www.manning.com/cantelon/"><img src="./node-in-action.webp" alt="Node.js in Action book cover"></a>
<figcaption><a href="http://www.manning.com/cantelon/">Node in Action</a></figcaption>
</figure>

A few links from the book:

- [Video: Node.js by Ryan Dahl](http://jsconf.eu/2009/video_nodejs_by_ryan_dahl.html)

  "Node.js might be the most exciting single piece of software in the current JavaScript universe. Ryan received standing ovations for his talk and he really deserved it!"

  The video is actually dead at this link, but its been archived to youtube.

  <figure>
  <div class="flex-video"><iframe title="Node.js by Ryan Dahl" loading="lazy" src="https://www.youtube-nocookie.com/embed/ztspvPYybIY" allowfullscreen></iframe></div>
  <figcaption>Node.js by Ryan Dahl</figcaption>
  </figure>

  [Slides](http://nodejs.org/jsconf.pdf)

- [Ryan Dahl Talk - NodeConf Theatre 2012.ogv](http://www.youtube.com/watch?v=GhFrlX0LdFA)

  <figure>
  <div class="flex-video"><iframe title="Ryan Dahl Talk — NodeConf Theatre 2012" loading="lazy" src="https://www.youtube-nocookie.com/embed/GhFrlX0LdFA" allowfullscreen></iframe></div>
  <figcaption>Ryan Dahl Talk — NodeConf Theatre 2012</figcaption>
  </figure>

  [Slides](http://tinyclouds.org/nodeconf2012.pdf)

- [Javascript: Your New Overlord](http://www.youtube.com/watch?v=Trurfqh_6fQ)

  <figure>
  <div class="flex-video"><iframe title="Javascript: Your New Overlord" loading="lazy" src="https://www.youtube-nocookie.com/embed/Trurfqh_6fQ" allowfullscreen></iframe></div>
  <figcaption>Javascript: Your New Overlord</figcaption>
  </figure>

- [Chrome Experiments](http://www.chromeexperiments.com)
- [jslinux](http://bellard.org/jslinux/) - Linux runnuing in your browser
- [Event Loops](https://en.wikipedia.org/wiki/Event_loop)
- [Asynchronous I/O](https://en.wikipedia.org/wiki/Asynchronous_I/O)
- [List of languages that compile to JS](https://github.com/jashkenas/coffeescript/wiki/List-of-languages-that-compile-to-JS)
- [ECMAScript](https://en.wikipedia.org/wiki/ECMAScript)
- [NGINX vs Apache](http://blog.webfaction.com/2008/12/a-little-holiday-present-10000-reqssec-with-nginx-2/)
- [The C10K problem](http://www.kegel.com/c10k.html)
- [Node.js about](http://nodejs.org/about/)
