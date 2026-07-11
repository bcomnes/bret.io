import { html } from 'uhtml-isomorphic'

export const topNavBar = () => {
  return html`
  <nav class="top-bar hide-print" aria-label="Main navigation">
    <span class="top-bar-left">
      <a href="/" class="top-bar-title" title="home">bret.io</a>
      <a href="/cv/" class="top-bar-link" title="resume">cv</a>
      <a href="/blog/" class="top-bar-link" title="blog">blog</a>
    </span>
    <span class="top-bar-right">
      <span class="top-bar-link" >
          <button class="light-dark-button" onclick="window.toggleTheme()" type="button" aria-label="Toggle theme"><img class="dark-icon" height="14" width="14" alt="" src="/globals/static/light-dark.svg"></button>
          <a id="neocities" href="https://neocities.org/site/bret" aria-label="Bret on Neocities"><img height="14" width="14" alt="" src="/globals/static/neocitieshead.svg"></a>
          <a rel="me" id="mastodon" href="https://fosstodon.org/@bcomnes" aria-label="Bret on Mastodon"><img height="14" width="14" alt="" src="/globals/static/mastodon.svg"></a>
          <a rel="me" href="https://github.com/bcomnes" aria-label="Bret on GitHub"><img class="dark-icon" height="14" width="14" alt="" src="/globals/static/github.svg"></a>
          <a id="signal" href="https://signal.me/#eu/ZMndG_JkN0O96b8zkvMIirVz_cXhd5CdsYWe7MrqBEsbnSSXmuZDeJatYleo-0wB" aria-label="Contact Bret on Signal"><img class="rounded-icon" height="14" width="14" alt="" src="/globals/static/signal.svg"></a>
          <a href="https://www.npmjs.com/~bret" aria-label="Bret on npm"><img class="rounded-icon" height="14" width="14" alt="" src="/globals/static/npm.svg"></a>
          <a rel="me" id="bluesky" href="https://bsky.app/profile/bret.io" aria-label="Bret on Bluesky"><img height="14" width="14" alt="" src="/globals/static/bsky.png"></a>
          <a rel="me" href="https://twitter.com/bcomnes" aria-label="Bret on X"><img class="rounded-icon" height="14" width="14" alt="" src="/globals/static/twtr.svg"></a>
          <a href="/feed.json" aria-label="JSON Feed"><img class="rounded-icon" height="14" width="14" alt="" src="/globals/static/jsonfeed.svg"></a>
          <a href="/feed.xml" aria-label="Atom feed"><img height="14" width="14" alt="" src="/globals/static/atom.svg" ></a>
      </span>
    </span>
  </nav>
  `
}

/**
 * @param {{
 *  githubRootUrl: string,
 *  page: { pageFile: { relname: string } }
 * }} options
 */
export const bottomFooterBar = ({
  githubRootUrl,
  page
}) => {
  return html`
  <footer class="top-bar hide-print">
    <span class="top-bar-left">
      <a href="#" class="top-bar-link">© Bret Comnes</a>
      <a href="${`${githubRootUrl}${page.pageFile.relname}`}" class="top-bar-link" title="edit site on github">edit</a>
    </span>
    <span class="top-bar-right">
      <a rel="me" href="mailto:bcomnes+website@gmail.com" class="top-bar-link" title="email">contact</a>
    </span>
  </footer>
  `
}
