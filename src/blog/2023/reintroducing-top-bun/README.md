---
layout: article
serif: true
title: "Reintroducing top-bun 7 🥐"
publishDate: "2023-11-23T15:14:54.910Z"
---

After some unexpected weekends of downtime looking after sick toddlers, I'm happy to re-introduce [`top-bun` v7][tb].

Re-introduce? Well, you may remember [`@siteup/cli`](https://github.com/bcomnes/top-bun/tree/v6.0.0), a spiritual offshoot of [`sitedown`](https://github.com/ungoldman/sitedown), the static site generator that turned a directory of markdown into a website.

## Whats new with `top-bun` v7? {#tb-v7}

Let's dive into the new feature, changes and additions in `top-bun` 7.

### Rename to `top-bun`

`@siteup/cli` is now `top-bun`.
As noted above, `@siteup/cli` was a name hack because I didn't snag the bare `npm` name when it was available, and someone else had the genius idea of taking the same name. Hey it happens.

I described the project to Chat-GPT and it recommended the following gems:

- `quick-brick`
- `web-erect`

OK Chat-GPT, pretty good, I laughed, but I'm not naming this `web-erect`.

The kids have a recent obsession with [Wallace & Gromit](https://wallaceandgromit.com) and we watched a lot of episodes while she was sick. Also I've really been enjoying 🥖 [bread themes](https://breadcrum.net) so I decided to name it after Wallace & Gromit's bakery "Top Bun" in their hit movie ["A Matter of Loaf and Death"](https://en.wikipedia.org/wiki/A_Matter_of_Loaf_and_Death).

<div class="responsive-container"><iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/zXBmZLmfQZ4?si=cGvWktfUU2xnqHrM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>

### A Docs Website

`top-bun` now builds it's own repo into a docs website. It's slightly better than the GitHub README.md view, so go check it out! It even has a real domain name so you know its for real.

- 🌎 [top-bun.org](https://top-bun.org)


<figure>
  <a href="./img/docs-site.png">
    <picture>
      <!-- <source srcset="./static/breadcrum-dark.png" media="(prefers-color-scheme: dark)"> -->
      <img loading="auto" src="./img/docs-site.png" alt="Screenshot of the docs site">
    </picture>
  </a>
  <figcaption>top-bun builds itself into its own docs website in an act dubbed "dogfooding".</figcaption>
</figure>

### `css` bundling is now handled by `esbuild`

`esbuild` is an amazing tool. `postcss` is a useful tool, but its slow and hard to keep up with. In `top-bun`, `css` bundling is now handled by [`esbuild`](https://esbuild.github.io/content-types/#css).
`css` bundling is now faster and less fragile, and still supports many of the same transforms that `siteup` had before. [CSS nesting](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting/Using_CSS_nesting) is now supported in every modern browser so we don't even need a transform for that. Some basic transforms and prefixes are auto-applied by setting a relatively modern browser target.

`esbuild` doesn't support import chunking on css yet though, so each `css` entrypoint becomes its own bundle. If `esbuild` ever gets this optimization, so will `top-bun`. In the meantime, `global.css`, `style.css` and now `layout.style.css` give you ample room to generally optimize your scoped css loading by hand. It's simpler and has less moving parts!

<figure>
  <a href="./img/esbuild-css.png">
    <picture>
      <!-- <source srcset="./static/breadcrum-dark.png" media="(prefers-color-scheme: dark)"> -->
      <img loading="auto" src="./img/esbuild-css.png" alt="Screenshot of esbuild css docs">
    </picture>
  </a>
  <figcaption>The esbuild css docs are worth a cruise through.</figcaption>
</figure>

### Multi-layout support

You can now have more than one layout!
In prior releases, you could only have a single `root` layout that you customized on a per-page basis with variables.
Now you can have as many layouts as you need.
**They can even nest**.
Check out this example of a nested layout from this website. It's named `article.layout.js` and imports the `root.layout.js`. It wraps the `children` and then passes the results to `root.layout.js`.

```js
// article.layout.js

import { html } from 'uhtml-isomorphic'
import { sep } from 'node:path'
import { breadcrumb } from '../components/breadcrumb/index.js'

import defaultRootLayout from './root.layout.js'

export default function articleLayout (args) {
  const { children, ...rest } = args
  const vars = args.vars
  const pathSegments = args.page.path.split(sep)
  const wrappedChildren = html`
    ${breadcrumb({ pathSegments })}
    <article class="article-layout h-entry" itemscope itemtype="http://schema.org/NewsArticle">
      <header class="article-header">
        <h1 class="p-name article-title" itemprop="headline">${vars.title}</h1>
        <div class="metadata">
          <address class="author-info" itemprop="author" itemscope itemtype="http://schema.org/Person">
            ${vars.authorImgUrl
              ? html`<img height="40" width="40"  src="${vars.authorImgUrl}" alt="${vars.authorImgAlt}" class="u-photo" itemprop="image">`
              : null
            }
            ${vars.authorName && vars.authorUrl
              ? html`
                  <a href="${vars.authorUrl}" class="p-author h-card" itemprop="url">
                    <span itemprop="name">${vars.authorName}</span>
                  </a>`
              : null
            }
          </address>
          ${vars.publishDate
            ? html`
              <time class="published-date dt-published" itemprop="datePublished" datetime="${vars.publishDate}">
                <a href="#" class="u-url">
                  ${(new Date(vars.publishDate)).toLocaleString()}
                </a>
              </time>`
            : null
          }
          ${vars.updatedDate
            ? html`<time class="dt-updated" itemprop="dateModified" datetime="${vars.updatedDate}">Updated ${(new Date(vars.updatedDate)).toLocaleString()}</time>`
            : null
          }
        </div>
      </header>

      <section class="e-content" itemprop="articleBody">
        ${typeof children === 'string'
          ? html([children])
          : children /* Support both uhtml and string children. Optional. */
        }
      </section>

      <!--
        <footer>
            <p>Footer notes or related info here...</p>
        </footer>
      -->
    </article>
    ${breadcrumb({ pathSegments })}
  `

  return defaultRootLayout({ children: wrappedChildren, ...rest })
}
```

### Layout styles and js bundles

With multi-layout support, it made sense to introduce two more style and js bundle types:

- Layout styles: styles that load on every page that uses a layout
- Layout bundles: js bundles that load on every page that uses a layout

Prior the `global.css` and `global.client.js` bundles served this need.

<figure>
  <a href="./img/layout-bundles.png">
    <picture>
      <!-- <source srcset="./static/breadcrum-dark.png" media="(prefers-color-scheme: dark)"> -->
      <img loading="auto" src="./img/layout-bundles.png" alt="Screenshot of layout bundles in an editor">
    </picture>
  </a>
  <figcaption>Layouts introduce a new asset scope in the form of layout clients and style.</figcaption>
</figure>


### Layouts and Global Assets live anywhere

Layouts, and `global.client.js`, etc used to have to live at the root of the project `src` directory. This made it simple to find them when building, and eliminated duplicate singleton errors, but the root of websites is already crowded. It was easy enough to find these things anywhere, so now you can organize these special files in any way you like. I've been using:

- `layouts`: A folder full of layouts
- `globals`: A folder full of the globally scoped files

<figure>
  <a href="./img/anywhere.png">
    <picture>
      <!-- <source srcset="./static/breadcrum-dark.png" media="(prefers-color-scheme: dark)"> -->
      <img loading="auto" src="./img/anywhere.png" alt="Screenshot of globals and layouts living anywhere in an editor">
    </picture>
  </a>
  <figcaption>You are free to organize globals and layouts wherever you want now. The globals and layouts folders are great choice!</figcaption>
</figure>

### Template files

Given the `top-bun` variable cascade system, and not all website files are html, it made sense to include a templating system for generating any kind of file from the `global.vars.js` variable set. This lets you generate random website "sidefiles" from your site variables.

It works great for generating RSS feeds for websites built with `top-bun`. Here is the template file that generates the RSS feed for this website:


```js
import pMap from 'p-map'
import jsonfeedToAtom from 'jsonfeed-to-atom'

/**
 * @template T
 * @typedef {import('@siteup/cli').TemplateAsyncIterator<T>} TemplateAsyncIterator
 */

/** @type {TemplateAsyncIterator<{
 *  siteName: string,
 *  siteDescription: string,
 *  siteUrl: string,
 *  authorName: string,
 *  authorUrl: string,
 *  authorImgUrl: string
 *  layout: string,
 *  publishDate: string
 *  title: string
 * }>} */
export default async function * feedsTemplate ({
  vars: {
    siteName,
    siteDescription,
    siteUrl,
    authorName,
    authorUrl,
    authorImgUrl
  },
  pages
}) {
  const blogPosts = pages
    .filter(page => ['article', 'book-review'].includes(page.vars.layout) && page.vars.published !== false)
    .sort((a, b) => new Date(b.vars.publishDate) - new Date(a.vars.publishDate))
    .slice(0, 10)

  const jsonFeed = {
    version: 'https://jsonfeed.org/version/1',
    title: siteName,
    home_page_url: siteUrl,
    feed_url: `${siteUrl}/feed.json`,
    description: siteDescription,
    author: {
      name: authorName,
      url: authorUrl,
      avatar: authorImgUrl
    },
    items: await pMap(blogPosts, async (page) => {
      return {
        date_published: page.vars.publishDate,
        title: page.vars.title,
        url: `${siteUrl}/${page.pageInfo.path}/`,
        id: `${siteUrl}/${page.pageInfo.path}/#${page.vars.publishDate}`,
        content_html: await page.renderInnerPage({ pages })
      }
    }, { concurrency: 4 })
  }

  yield {
    content: JSON.stringify(jsonFeed, null, '  '),
    outputName: 'feed.json'
  }

  const atom = jsonfeedToAtom(jsonFeed)

  yield {
    content: atom,
    outputName: 'feed.xml'
  }

  yield {
    content: atom,
    outputName: 'atom.xml'
  }
}
```


### Page Introspection

Pages, Layouts and Templates can now introspect every other page in the `top-bun` build.

You can now easily implement any of the following:

- RSS feeds
- Auto-populating index feeds
- Tag systems

Pages, Layouts and Templates receive a `pages` array that includes [PageData](https://github.com/bcomnes/top-bun/blob/e83ea560f86dabcda68b0f701c8bfa770aba91ed/lib/build-pages/page-data.js#L25) instances for every page in the build. Variables are already pre-resolved, so you can easily filter, sort and target various pages in the build.

### Full Type Support

`top-bun` now has full type support. It's achieved with [`types-in-js`][types-in-js] and it took a ton of time and effort.

The results are nice, but I'm not sure the juice was worth the squeeze. `top-bun` was working really well before types. Adding types required solidifying a lot of trivial details to make the type-checker happy. I don't even think a single runtime bug was solved. It did help clarify some of the more complex types that had developed over the first 2 years of development though.

The biggest improvement provided here is that the following types are now exported from `top-bun`:

```ts
LayoutFunction<T>
PostVarsFunction<T>
PageFunction<T>
TemplateFunction<T>
TemplateAsyncIterator<T>
```

You can use these to get some helpful auto-complete in LSP supported editors.

#### `types-in-js` not Typescript

This was the first major dive I did into a project with [`types-in-js`][types-in-js] support.
My overall conclusions are:

- `types-in-js` provides a superior development experience to developing in `.ts` by eliminating the development loop build step.
- [JSDoc](https://jsdoc.app) and `types-in-js` are in conflict with each other. `types-in-js` should win, its better than JSDoc in almost every way (but you still use both).
- Most of the JSDoc auto-generating documentation ecosystem doesn't support `types-in-js`. Find something that consumes the generated types instead of consuming the JSDoc blocs.
- There are a number of rough edges around importing types.
- The final api documentation features are nice.
- The internal types feel good, but were mostly a waste of time being introduced after the fact.
- I wish there was a way to strictly introduce types on just the public interfaces and work back, but this is challenging because many details come from deep within the program.
- Typescript puts upper limits on the dynamism normally allowed with JS. It's a superset syntax, that forces a subset of language functionality.
- `@ts-ignore` liberally. Take a pass or two to remove some later.

### Handlebars support in `md` and `html`

Previously, only `js` pages had access to the variable cascade inside of the page itself. Now `html` and `md` pages can access these variables with [handlebars](https://handlebarsjs.com) placeholders.

```markdown
## My markdown page

Hey this is a markdown page for \{{ vars.siteName }} that uses handlebars templates.
```

### Locally shipped default styles

Previously, if you opted for the default layout, it would import [mine.css](http://mine-css.neocities.org) from [unpkg](https://unpkg.com). This worked, but went against the design goal of making `top-bun` sites as reliable as possible (shipping all final assets to the dest folder).

Now when you build with the default layout, the default stylesheet (and theme picker js code) is built out into your `dest` folder.

### Built-in `browser-sync`

`@siteup/cli` previously didn't ship with a development server, meaning you had to run one in parallel when developing. This step is now eliminated now that `top-bun` ships [`browser-sync`](https://browsersync.io). `browser-sync` is one of the best Node.js development servers out there and offers a bunch of really helpful dev tools built right in, including scroll position sync so testing across devices is actually enjoyable.

If you aren't familiar with browser-sync, here are some screenshots of fun feature:

<figure class="borderless">
  <a href="./img/bs-remote-debugging.png">
    <picture>
      <!-- <source srcset="./static/breadcrum-dark.png" media="(prefers-color-scheme: dark)"> -->
      <img loading="auto" src="./img/bs-remote-debugging.png" alt="Screenshot of Browser Sync debugging">
    </picture>
  </a>
  <figcaption>BrowserSync remote debugging</figcaption>
</figure>

<figure class="borderless">
  <a href="./img/bs-grid.png">
    <picture>
      <!-- <source srcset="./static/breadcrum-dark.png" media="(prefers-color-scheme: dark)"> -->
      <img loading="auto" src="./img/bs-grid.png" alt="Screenshot of Browser Sync grid">
    </picture>
  </a>
  <figcaption>BrowserSync Grid overlay</figcaption>
</figure>

<figure class="borderless">
  <a href="./img/bs-outline.png">
    <picture>
      <!-- <source srcset="./static/breadcrum-dark.png" media="(prefers-color-scheme: dark)"> -->
      <img loading="auto" src="./img/bs-outline.png" alt="Screenshot of Browser Sync css outline">
    </picture>
  </a>
  <figcaption>BrowserSync CSS outline</figcaption>
</figure>

<figure class="borderless">
  <a href="./img/bs-depth.png">
    <picture>
      <!-- <source srcset="./static/breadcrum-dark.png" media="(prefers-color-scheme: dark)"> -->
      <img loading="auto" src="./img/bs-depth.png" alt="Screenshot of Browser Sync css depth">
    </picture>
  </a>
  <figcaption>BrowserSync CSS depth</figcaption>
</figure>

<figure class="borderless">
  <a href="./img/bs-network-throttle.png">
    <picture>
      <!-- <source srcset="./static/breadcrum-dark.png" media="(prefers-color-scheme: dark)"> -->
      <img loading="auto" src="./img/bs-network-throttle.png" alt="Screenshot of Browser Sync network throttle">
    </picture>
  </a>
  <figcaption>BrowserSync Network throttle</figcaption>
</figure>

### `top-bun` eject

`top-bun` now includes an `--eject` flag, that will write out the default layout, style, client and dependencies into your `src` folder and update `package.json`. This lets you easily get started with customizing default layouts and styles when you decide you need more control.

```console
√ default-layout % npx top-bun --eject

top-bun eject actions:
  - Write src/layouts/root.layout.mjs
  - Write src/globals/global.css
  - Write src/globals/global.client.mjs
  - Add mine.css@^9.0.1 to package.json
  - Add uhtml-isomorphic@^2.0.0 to package.json
  - Add highlight.js@^11.9.0 to package.json

Continue? (Y/n) y
Done ejecting files!
```

The default layout is always supported, and its of course safe to rely on that.

### Improved log output 🪵

The logging has been improved quite a bit. Here is an example log output from building this blog:

```console
> top-bun --watch

Initial JS, CSS and Page Build Complete
bret.io/src => bret.io/public
├─┬ projects
│ ├─┬ websockets
│ │ └── README.md: projects/websockets/index.html
│ ├─┬ tron-legacy-2021
│ │ └── README.md: projects/tron-legacy-2021/index.html
│ ├─┬ package-automation
│ │ └── README.md: projects/package-automation/index.html
│ └── page.js: projects/index.html
├─┬ jobs
│ ├─┬ netlify
│ │ └── README.md: jobs/netlify/index.html
│ ├─┬ littlstar
│ │ └── README.md: jobs/littlstar/index.html
│ ├── page.js:      jobs/index.html
│ ├── zhealth.md:   jobs/zhealth.html
│ ├── psu.md:       jobs/psu.html
│ └── landrover.md: jobs/landrover.html
├─┬ cv
│ ├── README.md: cv/index.html
│ └── style.css: cv/style-IDZIRKYR.css
├─┬ blog
│ ├─┬ 2023
│ │ ├─┬ reintroducing-top-bun
│ │ │ ├── README.md: blog/2023/reintroducing-top-bun/index.html
│ │ │ └── style.css: blog/2023/reintroducing-top-bun/style-E2RTO5OB.css
│ │ ├─┬ hello-world-again
│ │ │ └── README.md: blog/2023/hello-world-again/index.html
│ │ └── page.js: blog/2023/index.html
│ ├── page.js:   blog/index.html
│ └── style.css: blog/style-NDOJ4YGB.css
├─┬ layouts
│ ├── root.layout.js:             root
│ ├── blog-index.layout.js:       blog-index
│ ├── blog-index.layout.css:      layouts/blog-index.layout-PSZNH2YW.css
│ ├── blog-auto-index.layout.js:  blog-auto-index
│ ├── blog-auto-index.layout.css: layouts/blog-auto-index.layout-2BVSCYSS.css
│ ├── article.layout.js:          article
│ └── article.layout.css:         layouts/article.layout-MI62V7ZK.css
├── globalStyle:               globals/global-OO6KZ4MS.css
├── globalClient:              globals/global.client-HTTIO47Y.js
├── globalVars:                global.vars.js
├── README.md:                 index.html
├── style.css:                 style-E5WP7SNI.css
├── booklist.md:               booklist.html
├── about.md:                  about.html
├── manifest.json.template.js: manifest.json
├── feeds.template.js:         feed.json
├── feeds.template.js-1:       feed.xml
└── feeds.template.js-2:       atom.xml

[Browsersync] Access URLs:
 --------------------------------------
       Local: http://localhost:3000
    External: http://192.168.0.187:3000
 --------------------------------------
          UI: http://localhost:3001
 UI External: http://localhost:3001
 --------------------------------------
[Browsersync] Serving files from: /Users/bret/Developer/bret.io/public
Copy watcher ready
```

### Support for `mjs` and `cjs` file extensions

You can now name your page, template, vars, and layout files with the `mjs` or `cjs` file extensions. Sometimes this is a necessary evil. In general, set your `type` in your `package.json` correctly and stick with `.js`.

## What's next for `top-bun`

The current plan is to keep sitting on this feature set for a while. But I have some ideas:

- Tell the world about it?
- Server routes with [fastify](https://fastify.dev) (or expose a plugin to slot into an existing server)?
- Deeper integration with [`uhtml`](https://ghub.io/uhtml)?
- More web-component examples? `top-bun` is already one of the best environments for implementing sites that use web-components. Page bundles are a perfect place to register components!
- Comparisons with other tools in the "enterprise-js" ecosystem?

If you try out `top-bun`, I would love to hear about your experience. Do you like it? Do you hate it? [Open an discussion item.](https://github.com/bcomnes/top-bun/discussions) or reach out privately.


## History of `top-bun` {#history}

OK, now time for the story behind `top-bun` aka `@siteup/cli`.

I ran some experiments with orthogonal tool composition a few years ago. I realized I could build sophisticated module based websites by composing various tools together by simply running them in parallel.

What does this idea look like? See this snippet of a `package.json`:

```json
 { "scripts": {
    "build": "npm run clean && run-p build:*",
    "build:css": "postcss src/index.css -o public/bundle.css",
    "build:md": "sitedown src -b public -l src/layout.html",
    "build:feed": "generate-feed src/log --dest public && cp public/feed.xml public/atom.xml",
    "build:static": "cpx 'src/**/*.{png,svg,jpg,jpeg,pdf,mp4,mp3,js,json,gif}' public",
    "build:icon": "gravatar-favicons --config favicon-config.js",
    "watch": "npm run clean && run-p watch:* build:static",
    "watch:css": "run-s 'build:css -- --watch'",
    "watch:serve": "browser-sync start --server 'public' --files 'public'",
    "watch:md": "npm run build:md -- -w",
    "watch:feed": "run-s build:feed",
    "watch:static": "npm run build:static -- --watch",
    "watch:icon": "run-s build:icon",
    "clean": "rimraf public && mkdirp public",
    "start": "npm run watch"
  }
}
```

- I have [`postcss`](https://postcss.org) building css bundles, enabling an `@import` based workflow for css, as well as providing various transforms I found useful.
- The markdown is built with [`sitedown`](https://github.com/ungoldman/sitedown).
- I wrote a tool to generate a RSS feed from markdown called [`generate-feed`](https://github.com/bcomnes/generate-feed)
- I generate favicons from a gravatar identifier with [`gravatar-favicons`](https://github.com/bcomnes/gravatar-favicons).
- `js` bundling could easily be added in here with [`esbuild`][esbuild] or [rollup](https://ghub.io/rollup).
- Steps are grouped into `build` and `watch` prefixes, and managed with [npm-run-all2](https://github.com/bcomnes/npm-run-all2) which provides shortcuts to running these tasks in parallel.

I successfully implemented this pattern across 4-5 different websites I manged. It work beautifully. Some of the things I liked about it:

- ✅ Tools could be swapped out easily.
- ✅ I could experiment individual ideas on individual sites, without forcing them on every other project.
- ✅ All of the tools were versioned gated, and I could update them as I had time.
- ✅ It worked very well with [release automation](/projects/package-automation/README.md).

But it had a few drawbacks:

- ❌ I liked the pattern so much, that I wanted to add websites to more projects, but setting this all up was a hassle.
- ❌ When I discovered a change I liked, re-implementing the change across multiple projects become tedious.
- ⚠️ Orthogonal tool composition helps keep this arrangement clean and fast, but some steps really do benefit from the awareness of the results of other steps.

So I decided to roll up all of the common patterns into a single tool that included the discoveries of this process.

## `@siteup/cli` extended `sitedown`

Because it was clear `sitedown` provided the core structure of this pattern (making the website part), I extended the idea in the project `@siteup/cli`. Here are some of the initial features that project shipped with:

- Variable cascade + frontmatter: You could define global and page variables used to customize parts of the site layout. This lets you set the title, or other parts of the `<head>` tag easily from the [frontmatter](https://jekyllrb.com/docs/front-matter/) section of markdown pages.
- A `js` layout: This let you write a simple JS program that receives the variable cascade and child content of the page as a function argument, and return the contents of the page after applying any kind of template tool available in JS.
- `html` pages: [CommonMark](https://commonmark.org) supports `html` in markdown, but it also has some funny rules that makes it more picky about how the `html` is used. I wanted a way to access the full power of `html` without the overhead of markdown, and this page type unlocked that.
- `js` pages: Since I enjoy writing JavaScript, I also wanted a way to support generating pages using any templating system and data source imaginable so I also added support to generate pages from the return value of a JS function.
- JavaScript bundling: I wanted to make it super easy to include client side JavaScript, so it included some conventions for setting that up quickly and easily.
- CSS bundling: Instead of adding the complexity of css-modules or other transform-based scoped css solution, `siteup` opted to make it super easy to add a global `css` bundle, and page scoped `css` bundles, which both supported a `postcss` `@import` workflow and provided a few common transforms to make working with `css` tolerable (nesting, prefixing etc).
- Static files: Including static files was such a common pattern that I also included the ability, to copy over static files without any additional configuration. I believe `sitedown` also added this feature subsequently.
- Asset co-location: I wanted a way to co-locate assets, code and anything near where it was depended upon. It is such a natural way to organize complex collections, and so many tools break this, or require special locations for special files. Let me put it wherever I want in `src`!

After sitting on the idea of `siteup` for over a year, by the time I published it to `npm`, the name was taken, so I used the npm org name hack to get a similar name `@siteup/cli`. **SILLY NPM!**

I enjoyed how `@siteup/cli` came out, and have been using it for 2 year now. Thank you of course to [ungoldman](https://ungoldman.com) for laying the foundation of most of these tools and patterns. Onward and upward to `top-bun`!

![contribution graph](./img/contribs.png)

[tb]: https://github.com/bcomnes/top-bun
[esbuild]: https://esbuild.github.io
[types-in-js]: https://github.com/voxpelli/types-in-js
