/** @import { PageInfo } from '@domstack/static/types.js' */
/** @import { HtmlResult } from 'fragtml/types.js' */

import { html } from 'fragtml'

/** @returns {HtmlResult} */
export const topNavBar = () => {
  return html`
  <nav class="site-top-bar hide-print">
    <span class="site-top-bar-left">
      <a href="/" class="site-top-bar-title" title="home">bret.io</a>
      <a href="/resume/" class="site-top-bar-link" title="resume">resume</a>
      <a href="/blog/" class="site-top-bar-link" title="blog">blog</a>
    </span>
    <span class="site-top-bar-right">
      <span class="site-top-bar-social-links">
          <a id="neocities" href="https://neocities.org/site/bret"><img height="18" width="18" src="/globals/static/neocitieshead.svg"></a>
          <a rel="me" id="mastadon" href="https://fosstodon.org/@bcomnes"><img height="18" width="18" src="/globals/static/mastodon.svg"></a>
          <a rel="me" href="https://github.com/bcomnes" title="github"><img class="dark-icon" height="18" width="18" src="/globals/static/github.svg"></a>
          <a id="signal" href="https://signal.me/#eu/ZMndG_JkN0O96b8zkvMIirVz_cXhd5CdsYWe7MrqBEsbnSSXmuZDeJatYleo-0wB"><img class="rounded-icon" height="18" width="18" src="/globals/static/signal.svg"></a>
          <a href="https://www.npmjs.com/~bret" title="node packaged modules"><img class="rounded-icon" height="18" width="18" src="/globals/static/npm.svg"></a>
          <a rel="me" id="bluesky" href="https://bsky.app/profile/bret.io"><img height="18" width="18" src="/globals/static/bsky.png"></a>
          <a rel="me" href="https://twitter.com/bcomnes" title="twitter: @bcomnes"><img class="rounded-icon" height="18" width="18" src="/globals/static/twtr.svg"></a>
          <a href="/feed.json"><img class="rounded-icon" height="18" width="18" src="/globals/static/jsonfeed.svg"></a>
          <a href="/feed.xml"><img height="18" width="18" src="/globals/static/atom.svg" ></a>
      </span>
    </span>
  </nav>
  `
}

/**
 * @param {{ githubRootUrl: string, page: Pick<PageInfo, 'pageFile'> }} args
 * @returns {HtmlResult}
 */
export const bottomFotterBar = ({
  githubRootUrl,
  page
}) => {
  return html`
  <footer class="site-top-bar hide-print">
    <span class="site-top-bar-left">
      <a href="#" class="site-top-bar-link">© Bret Comnes</a>
      <a href="${`${githubRootUrl}${page.pageFile.relname}`}" class="site-top-bar-link" title="edit site on github">edit</a>
    </span>
    <span class="site-top-bar-right">
      <a rel="me" href="mailto:bcomnes+website@gmail.com" class="site-top-bar-link" title="email">contact</a>
    </span>
  </footer>
  `
}
