import { renderBlogIndexList } from './components/blog-index-list/index.js'

/** @import { GlobalDataFunction, GlobalDataFunctionParams } from '@domstack/static/types.js' */

/**
 * @typedef {{
 *   path: string,
 *   url: string,
 *   title: string,
 *   publishDate: string
 * }} BlogPost
 */

/**
 * @typedef {{
 *   year: number,
 *   posts: BlogPost[]
 * }} BlogIndex
 */

/** @typedef {{ from: string, to: string }} PageRedirect */

/**
 * @param {GlobalDataFunctionParams['pages']} pages
 * @returns {PageRedirect[]}
 */
function collectRedirects (pages) {
  /** @type {PageRedirect[]} */
  const redirects = [
    { from: '/projects/', to: '/blog/' },
    { from: '/jobs/', to: '/blog/' }
  ]
  const redirectOwners = new Map(redirects.map(({ from }) => [from, 'global data']))

  for (const page of pages) {
    const redirectFrom = page.vars.redirectFrom
    if (redirectFrom === undefined) continue

    const source = page.pageInfo.pageFile.relname
    if (!Array.isArray(redirectFrom)) {
      throw new TypeError(`redirectFrom on "${source}" must be an array of same-origin URL paths`)
    }

    for (const from of redirectFrom) {
      if (typeof from !== 'string') {
        throw new TypeError(`redirectFrom entries on "${source}" must be strings`)
      }
      if (from.trim() !== from || !from.startsWith('/') || from.startsWith('//')) {
        throw new Error(`Invalid redirectFrom "${from}" on "${source}": expected a same-origin URL path beginning with "/"`)
      }
      if (from.includes('?') || from.includes('#')) {
        throw new Error(`Invalid redirectFrom "${from}" on "${source}": queries and fragments are not supported`)
      }
      if (from.includes('\\') || from.split('/').some(part => part === '.' || part === '..')) {
        throw new Error(`Invalid redirectFrom "${from}" on "${source}": path must not contain ".", "..", or backslash segments`)
      }

      const existingSource = redirectOwners.get(from)
      if (existingSource) {
        throw new Error(`redirectFrom "${from}" is declared by both "${existingSource}" and "${source}"`)
      }

      redirectOwners.set(from, source)
      redirects.push({ from, to: page.pageInfo.url })
    }
  }

  return redirects
}

/**
 * @param {GlobalDataFunctionParams['pages']} pages
 * @returns {BlogPost[]}
 */
function collectBlogPosts (pages) {
  return pages
    .filter(page => ['article', 'book-review'].includes(page.vars.layout) && page.vars.published !== false)
    .map(page => {
      const value = page.vars.publishDate
      if (typeof value !== 'string' && !(value instanceof Date)) {
        throw new TypeError(`Blog post "${page.pageInfo.path}" needs a publishDate`)
      }

      const publishDate = new Date(value.valueOf())
      if (Number.isNaN(publishDate.valueOf())) {
        throw new TypeError(`Blog post "${page.pageInfo.path}" has an invalid publishDate`)
      }

      return {
        path: page.pageInfo.path,
        url: page.pageInfo.url,
        title: String(page.vars.title ?? 'Untitled'),
        publishDate: publishDate.toISOString()
      }
    })
    .sort((a, b) => b.publishDate.localeCompare(a.publishDate))
}

/**
 * @param {BlogPost[]} blogPosts
 * @returns {BlogIndex[]}
 */
function collectBlogIndexes (blogPosts) {
  /** @type {Map<number, BlogPost[]>} */
  const postsByYear = new Map()

  for (const post of blogPosts) {
    const year = new Date(post.publishDate).getUTCFullYear()
    postsByYear.set(year, [...(postsByYear.get(year) ?? []), post])
  }

  return [...postsByYear]
    .map(([year, posts]) => ({ year, posts }))
    .sort((a, b) => b.year - a.year)
}

/** @type {GlobalDataFunction} */
export default function globalData ({ pages }) {
  const blogPosts = collectBlogPosts(pages)
  const blogIndexes = collectBlogIndexes(blogPosts)
  const redirects = collectRedirects(pages)

  return {
    blogPosts,
    blogIndexes,
    redirects,
    recentBlogPosts: blogPosts.slice(0, 5),
    blogPostsHtml: renderBlogIndexList(blogPosts.slice(0, 5), { more: true })
  }
}
