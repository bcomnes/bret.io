/** @import { DataDeps, PagesForLayout } from '@domstack/static/types.js' */
/** @import { RedirectData } from './global.data.js' */
/** @import { SiteGlobalVars } from './layouts/layout-registry.ts' */

/** @typedef {{ layout: 'redirect', title: string, redirectTo: string, noindex: boolean }} RedirectPageVars */

/** @satisfies {DataDeps<RedirectData>} */
export const dataDeps = ['redirects']

/** @param {string} from */
function redirectOutputName (from) {
  if (!from.startsWith('/') || from.startsWith('//')) {
    throw new Error(`redirectFrom must be a same-origin URL path: ${from}`)
  }
  if (from.includes('?') || from.includes('#')) {
    throw new Error(`redirectFrom must not include a query or fragment: ${from}`)
  }

  const relativePath = from.slice(1)
  if (relativePath.length === 0) return 'index.html'
  return relativePath.endsWith('/') ? `${relativePath}index.html` : relativePath
}

/** @type {PagesForLayout<'redirect', RedirectPageVars, SiteGlobalVars, RedirectData>} */
export default function redirectPages ({ data }) {
  return data.redirects.map(({ from, to }) => ({
    outputName: redirectOutputName(from),
    vars: {
      layout: 'redirect',
      title: 'Redirecting…',
      redirectTo: to,
      noindex: true
    }
  }))
}
