/** @import { PageInfo } from '@domstack/static/types.js' */
/** @import { HtmlResult } from 'fragtml/types.js' */

import { html } from 'fragtml'

/** @returns {HtmlResult} */
export const topNavBar = () => {
  return html`
  <nav class="site-top-bar hide-print" aria-label="Main navigation">
    <span class="site-top-bar-left">
      <a href="/" class="site-top-bar-title" title="home">bret.io</a>
      <a href="/resume/" class="site-top-bar-link" title="resume">resume</a>
      <a href="/blog/" class="site-top-bar-link" title="blog">blog</a>
    </span>
    <span class="site-top-bar-right">
      <span class="site-top-bar-social-links">
          <a id="neocities" href="https://neocities.org/site/bret" aria-label="Bret on Neocities"><img height="18" width="18" alt="" src="/globals/static/neocitieshead.svg"></a>
          <a rel="me" id="mastodon" href="https://fosstodon.org/@bcomnes" aria-label="Bret on Mastodon"><img height="18" width="18" alt="" src="/globals/static/mastodon.svg"></a>
          <a rel="me" href="https://github.com/bcomnes" aria-label="Bret on GitHub"><img class="dark-icon" height="18" width="18" alt="" src="/globals/static/github.svg"></a>
          <a id="signal" href="https://signal.me/#eu/ZMndG_JkN0O96b8zkvMIirVz_cXhd5CdsYWe7MrqBEsbnSSXmuZDeJatYleo-0wB" aria-label="Contact Bret on Signal"><img class="rounded-icon" height="18" width="18" alt="" src="/globals/static/signal.svg"></a>
          <a href="https://www.npmjs.com/~bret" aria-label="Bret on npm"><img class="rounded-icon" height="18" width="18" alt="" src="/globals/static/npm.svg"></a>
          <a rel="me" id="bluesky" href="https://bsky.app/profile/bret.io" aria-label="Bret on Bluesky"><img height="18" width="18" alt="" src="/globals/static/bsky.png"></a>
          <a rel="me" href="https://twitter.com/bcomnes" aria-label="Bret on X"><img class="rounded-icon" height="18" width="18" alt="" src="/globals/static/twtr.svg"></a>
          <a href="/feed.json" aria-label="JSON Feed"><img class="rounded-icon" height="18" width="18" alt="" src="/globals/static/jsonfeed.svg"></a>
          <a href="/feed.xml" aria-label="Atom feed"><img height="18" width="18" alt="" src="/globals/static/atom.svg" ></a>
      </span>
    </span>
  </nav>
  `
}

/**
 * @param {{ githubRootUrl: string, page: Pick<PageInfo, 'pageFile'> }} args
 * @returns {HtmlResult}
 */
export const bottomFooterBar = ({
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
