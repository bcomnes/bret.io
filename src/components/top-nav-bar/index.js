import { html } from 'uhtml-isomorphic'

export const topNavBar = () => {
  return html`
  <nav class="top-bar hide-print">
    <span class="top-bar-left">
      <a href="/" class="top-bar-title" title="home">bret.io</a>
      <a href="/cv/" class="top-bar-link" title="resume">resume</a>
      <a href="/blog/" class="top-bar-link" title="blog">blog</a>
    </span>
    <span class="top-bar-right">
      <span class="top-bar-link" >
          <input class="dark-icon light-dark-button" onclick="window.toggleTheme()" height="14" width="14" type="image" alt="Toogle Theme" height="14" width="14" src="/globals/static/light-dark.svg">
          <a id="neocities" href="https://neocities.org/site/bret"><img height="14" width="14" src="/globals/static/neocitieshead.svg"></a>
          <a rel="me" id="mastadon" href="https://fosstodon.org/@bcomnes"><img height="14" width="14" src="/globals/static/mastodon.svg"></a>
          <a rel="me" href="https://github.com/bcomnes" title="github"><img class="dark-icon" height="14" width="14" src="/globals/static/github.svg"></a>
          <a href="https://www.npmjs.com/~bret" title="node packaged modules"><img class="rounded-icon" height="14" width="14" src="/globals/static/npm.svg"></a>
          <a rel="me" id="bluesky" href="https://bsky.app/profile/bret.io"><img height="14" width="14" src="/globals/static/bsky.png"></a>
          <a rel="me" href="https://twitter.com/bcomnes" title="twitter: @bcomnes"><img class="rounded-icon" height="14" width="14" src="/globals/static/twtr.svg"></a>
          <a href="/feed.json"><img class="rounded-icon" height="14" width="14" src="/globals/static/jsonfeed.svg"></a>
          <a href="/feed.xml"><img height="14" width="14" src="/globals/static/atom.svg" ></a>
      </span>
    </span>
  </nav>
  `
}

export const bottomFotterBar = ({
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
