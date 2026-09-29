---
layout: article
title: "LaTeX Section Font Sizing in TextMate 2"
publishDate: "2013-03-13"
legacyDate: "2013-03-13 21:12"
handlebars: false
redirectFrom:
  - "/2013/03/13/latex-section-font-sizing/"
tags: [LaTeX, TextMate, Programming, Markup]
---

> **Archived post — originally published 2013-03-13.**
>
> See the later [LaTeX Font Settings Hits 1.0 announcement](/blog/2014/latex-font-settings-hits-10/).

Like how TextMate 2 resizes the font of your header levels while editing your markdown files?  Do you also wish that, similarly, your LaTeX sections had a different font size to help visually distinguish them from the wall of markup surrounding them?  Well due to [some discussion over at stack exchange](http://tex.stackexchange.com/questions/98574/textmate-2-how-can-increase-font-size-of-sections-in-the-markup-code), and a little encouraging in [#textmate](irc://chat.us.freenode.net:+7000/#textmate) to help [expand the scope selectors](https://github.com/textmate/latex.tmbundle/commit/65eaf2b8efbf466e9075c9f947a25a124b53f3f7) in the LaTeX.tmbundle, I now present the [LaTeX-Section-Font-Sizes.tmbundle](https://github.com/bcomnes/LaTeX-Section-Font-Sizes.tmbundle).

<figure>
  <a href="./screenshot.png"><img src="./screenshot.png" width="548" height="711" alt="screenshot of bundle effects" loading="lazy"></a>
  <figcaption>screenshot of bundle effects</figcaption>
</figure>

To install, just navigate to ~/Library/Application\ Support/Avian/Bundles/ and perform a `git clone https://github.com/bcomnes/LaTeX-Section-Font-Sizes.tmbundle.git` and you should be good to go.  You can also download a [.zip or tar.gz](https://github.com/bcomnes/LaTeX-Section-Font-Sizes.tmbundle/tags) if you prefer to avoid git.

Right now it changes the font and size of the section, subsection, and subsubsections in the LaTeX bundle.  The bundle will get updates as needed but suggestions are always appreciated.  Have have a look around in the bundle editor once it is installed to see how this was achieved.  It is really simple and it would be neat to see how others could expand upon it.
