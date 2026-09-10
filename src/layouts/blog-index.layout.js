import { html, raw } from 'fragtml'
import { sep } from 'node:path'
import { breadcrumb } from '#components/breadcrumb/index.js'

/** @import { LayoutFunction } from '@domstack/static/types.js' */
/** @import { HtmlResult } from 'fragtml/types.js' */
/** @import { LayoutChildren, RootLayoutVars } from './root.layout.js' */

/**
 * @typedef {RootLayoutVars & {
 *  title: string
 * }} BlogIndexVars
 */

export const parentLayout = 'root'

/** @type {LayoutFunction<BlogIndexVars, LayoutChildren, HtmlResult>} */
export default function blogIndexLayout (args) {
  const { children } = args
  const pathSegments = args.page.path.split(sep)
  return html`
    ${breadcrumb({ pathSegments })}
    <h1>${args.vars.title}</h1>
    ${typeof children === 'string' ? raw(children) : children}
  `
}
