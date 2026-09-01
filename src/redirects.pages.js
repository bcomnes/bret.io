/** @import { PagesFunction } from '@domstack/static/types.js' */

/** @typedef {{ from: string, to: string }} PageRedirect */
/** @typedef {{ redirects: PageRedirect[] }} RedirectData */

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

/** @type {PagesFunction<Record<string, any>, string, RedirectData>} */
export default function redirectPages ({ vars }) {
  return vars.redirects.map(({ from, to }) => ({
    outputName: redirectOutputName(from),
    vars: {
      layout: 'redirect',
      title: 'Redirecting…',
      redirectTo: to,
      noindex: true
    }
  }))
}
