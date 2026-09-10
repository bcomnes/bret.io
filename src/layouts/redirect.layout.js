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
    <h1>${vars.title}</h1>
    <p>This page has moved. If you aren’t redirected automatically, follow the link below.</p>
    <p><a href="${vars.redirectTo}">${vars.redirectTo}</a></p>
  `
}
