import { html } from 'fragtml'

/** @import { LayoutFunction, LayoutVars } from '@domstack/static/types.js' */
/** @import { HtmlResult } from 'fragtml/types.js' */
/** @import { LayoutChildren, RootLayoutVars } from './root.layout.js' */

/** @typedef {RootLayoutVars & { title: string, redirectTo: string }} RedirectLayoutVars */

export const parentLayout = 'root'

/** @satisfies {LayoutVars<Partial<RedirectLayoutVars>>} */
export const vars = {
  noindex: true
}

/** @type {LayoutFunction<RedirectLayoutVars, LayoutChildren, HtmlResult>} */
export default function redirectLayout ({ vars }) {
  return html`
    <section class="redirect-page" aria-labelledby="redirect-title">
      <span class="redirect-symbol" aria-hidden="true">↗</span>
      <p class="redirect-eyebrow">Page moved</p>
      <h1 id="redirect-title">${vars.title}</h1>
      <p class="redirect-description">This page has a new home. If you aren’t redirected automatically, use the link below to continue.</p>
      <div class="redirect-destination">
        <span class="redirect-label">New address</span>
        <a href="${vars.redirectTo}">${vars.redirectTo}</a>
      </div>
      <div class="redirect-actions">
        <a class="redirect-continue" href="${vars.redirectTo}">Continue to page <span aria-hidden="true">→</span></a>
        <a class="redirect-home" href="/">Back to home</a>
      </div>
    </section>
  `
}
