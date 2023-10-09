---
layout: article
title: "Tron Legacy 2021"
publishDate: "2021-08-05T23:09:46.781Z"
---

I updated the Sublime Text [`Tron Color Scheme`](https://packagecontrol.io/packages/Tron%20Color%20Scheme) today after a few weeks of reworking it for the recent [release of Sublime Text 4](https://www.sublimetext.com/blog/articles/sublime-text-4).

The [`2.0.0` release](https://github.com/bcomnes/sublime-tron-color-scheme/releases/tag/v2.0.0) converts the older [`.tmTheme`](https://www.sublimetext.com/docs/color_schemes_tmtheme.html) format into the Sublime specific theme format.
Overall the new Sublime theme format ([`.sublime-color-scheme`](https://www.sublimetext.com/docs/color_schemes.html)) is a big improvement, largely due to its simple JSON structure and its variables support.

JSON is, despite the common arguments against it, super readable and easily read and written by humans.
The variable support makes the process of making a theme a whole lot more automatic, since you no longer have to find and replace colors all over the place.

The biggest problem I ran into was poor in-line color highlighting when working with colors, so I ended up using a VSCode plugin called [`Color Highlight`](https://marketplace.visualstudio.com/items?itemName=naumovs.color-highlight) in a separate window.
Sublime has a great plugin also called [`Color Highlight`](https://packagecontrol.io/packages/Color%20Highlight) that usually works well, but not in this case.
The Sublime `Color Highlight` variant actually does temporary modifications to color schemes, which seriously gets in the way when working on color scheme files.

The rewrite is based it off of the new [Mariana Theme](https://www.youtube.com/watch?v=_HoltQwvF2o) that ships with ST4, so the theme should have support for most of the latest features in ST4 though there are surely features that even Mariana missed.
Let me know if you know of any.

Here a few other points of consideration made during the rewrite:

- Remove the other theme variants. A breaking change, but they were poorly maintained to begin with.
- Renamed the theme file to `Tron Legacy 4 (Dark)`.
- [A light theme is in order](https://github.com/bcomnes/sublime-tron-color-scheme/pull/8), but its a non-trivial rewrite to support a light mode.

<figure class="borderless">
  <img src="./js.png" alt="Tron Legacy 4 JS Syntax Example">
  <figcaption>JS Syntax example</figcaption>
</figure>

<figure class="borderless">
  <img src="./md.png" alt="Tron Legacy 4 Markdown Syntax Example">
  <figcaption>Markdown Syntax example</figcaption>
</figure>

<figure class="borderless">
  <img src="./py.png" alt="Tron Legacy 4 Python Syntax Example">
  <figcaption>Python Syntax example</figcaption>
</figure>

<figure class="borderless">
  <img src="./c.png" alt="Tron Legacy 4 C Syntax Example">
  <figcaption>C Syntax example</figcaption>
</figure>

<figure class="borderless">
  <img src="./diff.png" alt="Tron Legacy 4 diff Syntax Example">
  <figcaption>diff Syntax example</figcaption>
</figure>

Here a few more relevant links and please let me know what you think if you try it out.

- [github.com/bcomnes/sublime-tron-color-scheme](https://github.com/bcomnes/sublime-tron-color-scheme)
- [Release page](https://github.com/bcomnes/sublime-tron-color-scheme/releases/tag/v2.0.0)

## Syndication

- <a href="https://twitter.com/bcomnes/status/1423418998725742602" rel="syndication" class="u-syndication">twitter thread</a>

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Sublime Tron Legacy color scheme fully updated for <a href="https://twitter.com/sublimehq?ref_src=twsrc%5Etfw">@sublimehq</a> Text 4. Full syntax support, lots of other small improvements. Also it supports &#39;glow&#39; text✌️ <a href="https://t.co/vShbGThgDF">pic.twitter.com/vShbGThgDF</a></p>&mdash; 🌌🌵🛸Bret🏜👨‍👩‍👧🚙 (@bcomnes) <a href="https://twitter.com/bcomnes/status/1423418998725742602?ref_src=twsrc%5Etfw">August 5, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<small><date>2021-08-05T23:09:46.781Z</date></small>

*[ST4]: Sublime Text 4
