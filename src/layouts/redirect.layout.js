import { html, render } from 'uhtml-isomorphic'

/** @import { LayoutFunction } from '@domstack/static/types.js' */

/** @type {LayoutFunction<{ title: string, redirectTo: string }>} */
export default function redirectLayout ({ vars }) {
  const refresh = `0;url=${vars.redirectTo}`

  return render(String, html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="robots" content="noindex">
        <meta http-equiv="refresh" content="${refresh}">
        <link rel="canonical" href="${vars.redirectTo}">
        <title>${vars.title}</title>
      </head>
      <body>
        <p>Redirecting to <a href="${vars.redirectTo}">${vars.redirectTo}</a></p>
      </body>
    </html>`)
}
