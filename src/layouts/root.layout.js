import { html } from 'uhtml-isomorphic'

export default async function rootLayout ({
  vars: {
    title,
    siteName
  },
  scripts,
  styles,
  children
}) {
  return html`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>${title ? `${title} | ` : ''}${siteName}</title>
    <meta name='viewport' content='initial-scale=1, viewport-fit=cover'>

    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="shortcut icon" href="/favicon.ico">
    <link rel="apple-touch-icon" href="/apple-touch-icon-180x180.png">
    <link rel="manifest" href="/manifest.json">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="${siteName}">
    <meta itemprop="publisher" content="${siteName}">
    <meta property="og:site_name" content="${siteName}">

    <link rel="alternate" title="${siteName} Blog (JSON Feed)" type="application/json" href="/feed.json" />
    <link rel="alternate" title="${siteName} Blog (JSON Feed)" type="application/feed+json" href="/feed.json" />
    <link rel="alternate" title="${siteName} Blog (RSS Feed)" type="application/rss+xml"  href="/feed.xml" />

    <meta name="google-site-verification" content="-gd5D4qtAADYPG5Iwbl7Z1265Dt6fzf1H5BQItIbsps" />
    <link rel="authorization_endpoint" href="https://indieauth.com/auth">
    <link rel="token_endpoint" href="https://tokens.indieauth.com/token">
    <link rel="me" href="https://micro.blog/bret" />

    ${scripts
      ? scripts.map(script => html`<script src="${script}" type='module'></script>`)
      : null
    }
    ${styles
      ? styles.map(style => html`<link rel="stylesheet" href=${style} />`)
      : null
    }
  </head>
  <body class="safe-area-inset">
    <nav class="top-bar hide-print">
      <a href="/" class="top-bar-title" title="home">bret.io</a>
      <a href="/cv/" class="top-bar-link" title="resume">cv</a>
      <a href="/blog/2023/" class="top-bar-link" title="blog">blog</a>
      <a href="https://hifiwi.fi" class="top-bar-link" title="HifiWi.fi">hifiwi.fi</a>
      <span class="top-bar-right">
        <span class="top-bar-link" >
            <input class="dark-icon light-dark-button" onclick="window.toggleTheme()" height="14" width="14" type="image" alt="Toogle Theme" height="14" width="14" src="/static/light-dark.svg">
            <a id="neocities" href="https://neocities.org/site/bret"><img height="14" width="14" src="/static/neocitieshead.svg"></a>
            <a rel="me" id="mastadon" href="https://fosstodon.org/@bcomnes"><img height="14" width="14" src="/static/mastodon.svg"></a>
            <a rel="me" id="bluesky" href="https://bsky.app/profile/bret.io"><img height="14" width="14" src="/static/bsky.png"></a>
            <a id="microblog" href="https://micro.blog/bret"><img height="14" width="14" src="/static/microblog.svg"></a>
            <a rel="me" href="https://github.com/bcomnes" title="github"><img class="dark-icon" height="14" width="14" src="/static/github.svg"></a>
            <a href="https://npmjs.com/~bret" title="node packaged modules"><img class="rounded-icon" height="14" width="14" src="/static/npm.svg"></a>
            <a rel="me" href="https://twitter.com/bcomnes" title="twitter: @bcomnes"><img class="rounded-icon" height="14" width="14" src="/static/twtr.svg"></a>
            <a href="/feed.json"><img class="rounded-icon" height="14" width="14" src="/static/jsonfeed.svg"></a>
            <a href="/feed.xml"><img height="14" width="14" src="/static/atom.svg" ></a>
        </span>
      </span>
    </nav>
    <main class="markdown-body mine-layout">
      ${typeof children === 'string' ? html([children]) : children /* Support both uhtml and string children. Optional. */}
    </main>
    <footer class="top-bar hide-print">
      <a href="#" class="top-bar-link">© Bret Comnes</a>
      <a href="https://github.com/bcomnes/bret.io/tree/master/src" class="top-bar-link" title="edit site on github">edit</a>
      <span class="top-bar-right hide-print">
        <a rel="me" href="mailto:bcomnes+website@gmail.com" class="top-bar-link" title="email">contact</a>
      </span>
    </footer>
  </body>
</html>`
}
