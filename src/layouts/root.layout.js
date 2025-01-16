import { html } from 'uhtml-isomorphic'
import cn from 'classnames'
import { topNavBar, bottomFotterBar } from '../components/top-nav-bar/index.js'

/**
 * @template T
 * @typedef {import('top-bun').LayoutFunction<T>} LayoutFunction
 */

/**
 * @typedef {{
 *  title: string,
 *  description: string,
 *  siteName: string,
 *  githubRootUrl: string,
 *  siteUrl: string,
 *  serif: boolean,
 *  image: string,
 *  siteTwitter: string,
 *  [key: string]: any
 * }} RootLayoutVars
 */

/** @type {LayoutFunction<RootLayoutVars>} */
export default async function rootLayout ({
  vars: {
    title,
    description,
    siteName,
    siteUrl,
    githubRootUrl,
    serif,
    image,
    siteTwitter
  },
  scripts,
  styles,
  children,
  page
  /* pages */
}) {
  const resolvedURL = `${siteUrl}/${page.path}${page.path.endsWith('.html') ? '' : '/'}`
  return html`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>${title ? `${title} | ` : ''}${siteName}</title>
    <meta name='viewport' content='initial-scale=1, viewport-fit=cover'>

    <link rel="icon" type="image/x-icon" href="/favicons/favicon.ico">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="48x48" href="/favicons/favicon-48x48.png">
    <link rel="apple-touch-icon" sizes="57x57" href="/favicons/apple-touch-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="/favicons/apple-touch-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="/favicons/apple-touch-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="/favicons/apple-touch-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="/favicons/apple-touch-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="/favicons/apple-touch-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="/favicons/apple-touch-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/favicons/apple-touch-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="167x167" href="/favicons/apple-touch-icon-167x167.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon-180x180.png">
    <link rel="apple-touch-icon" sizes="1024x1024" href="/favicons/apple-touch-icon-1024x1024.png">
    <link rel="manifest" href="/manifest.json">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="${siteName}">
    <meta itemprop="publisher" content="${siteName}">

    <meta name="twitter:image" content="${image.startsWith('/') ? `${siteUrl}${image}` : `${resolvedURL}${image}`}">
    <meta name="twitter:site" content="${siteTwitter}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title ?? siteName}">
    <meta name="twitter:description" content="${description}">
    <meta property="og:image" content="${image.startsWith('/') ? `${siteUrl}${image}` : `${resolvedURL}${image}`}">
    <meta property="og:image:alt" content="${description}">
    <meta property="og:site_name" content="${siteName}">
    <meta property="og:type" content="object">
    <meta property="og:title" content="${title ?? siteName}">
    <meta property="og:url" content="${resolvedURL}">
    <meta property="og:description" content="${description}">

    <link rel="alternate" title="${`${siteName} Blog (JSON Feed)`}" type="application/json" href="/feed.json">
    <link rel="alternate" title="${`${siteName} Blog (JSON Feed)`}" type="application/feed+json" href="/feed.json">
    <link rel="alternate" title="${`${siteName} Blog (RSS/Atom Feed)`}" type="application/atom+xml"  href="/feed.xml">

    <meta name="google-site-verification" content="-gd5D4qtAADYPG5Iwbl7Z1265Dt6fzf1H5BQItIbsps">
    <link rel="authorization_endpoint" href="https://indieauth.com/auth">
    <link rel="token_endpoint" href="https://tokens.indieauth.com/token">
    <link rel="me" href="https://micro.blog/bret">

    ${scripts
      ? scripts.map(script => html`<script src="${script}" type='module'></script>`)
      : null
    }
    ${styles
      ? styles.map(style => html`<link rel="stylesheet" href=${style}>`)
      : null
    }
  </head>
  <body class="safe-area-inset">
    ${topNavBar()}
    <main class="${cn(['markdown-body', 'mine-layout', { serif }])}" >
      ${page.draft ? html`<div>DRAFT</div>` : null}
      ${typeof children === 'string' ? html([children]) : children /* Support both uhtml and string children. Optional. */}
    </main>
    ${bottomFotterBar({
      githubRootUrl,
      page
    })}
  </body>
</html>`
}
