import pMap from 'p-map'
import { renderBlogIndexList } from './components/blog-index-list/index.js'

/** @import { AsyncGlobalDataFunction, GlobalDataFunctionParams } from '@domstack/static/types.js' */

/**
 * @typedef {{
 *   path: string,
 *   url: string,
 *   title: string,
 *   publishDate: string,
 *   draft: boolean
 * }} BlogPost
 */

/**
 * @typedef {{
 *   year: number,
 *   posts: BlogPost[]
 * }} BlogIndex
 */

/** @typedef {{ from: string, to: string }} PageRedirect */
/** @typedef {BlogPost & { contentHtml: string }} FeedPost */
/**
 * @typedef {{
 *   blogPosts: BlogPost[],
 *   blogIndexes: BlogIndex[],
 *   redirects: PageRedirect[],
 *   recentBlogPosts: BlogPost[],
 *   blogPostsHtml: string,
 *   feedPosts: FeedPost[],
 *   sitemapUrls: string[]
 * }} GlobalData
 */
/** @typedef {Pick<GlobalData, 'blogPosts' | 'blogIndexes'>} BlogData */
/** @typedef {Pick<GlobalData, 'redirects'>} RedirectData */
/** @typedef {Pick<GlobalData, 'feedPosts'>} FeedData */
/** @typedef {Pick<GlobalData, 'sitemapUrls'>} SitemapData */
/**
 * @typedef {{
 *   blogPost?: BlogPost,
 *   feedPost?: FeedPost,
 *   redirects: PageRedirect[],
 *   url: string,
 *   noindex: boolean
 * }} GlobalDataEntry
 */
/** @typedef {Map<string, GlobalDataEntry>} GlobalDataState */

/**
 * @param {GlobalDataFunctionParams['pages'][number]} page
 * @returns {PageRedirect[]}
 */
function collectPageRedirects (page) {
  const redirectFrom = page.vars.redirectFrom
  if (redirectFrom === undefined) return []

  const source = page.pageInfo.pageFile.relname
  if (!Array.isArray(redirectFrom)) {
    throw new TypeError(`redirectFrom on "${source}" must be an array of same-origin URL paths`)
  }

  return redirectFrom.map(from => {
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

    return { from, to: page.pageInfo.url }
  })
}

/**
 * @param {GlobalDataFunctionParams['pages'][number]} page
 * @returns {GlobalDataEntry}
 */
function collectEntry (page) {
  const blogPost = collectBlogPost(page)
  return {
    ...(blogPost ? { blogPost } : {}),
    redirects: collectPageRedirects(page),
    url: page.pageInfo.url,
    noindex: Boolean(page.vars.noindex)
  }
}

/**
 * @param {Map<string, GlobalDataEntry>} entries
 * @returns {PageRedirect[]}
 */
function collectRedirects (entries) {
  /** @type {PageRedirect[]} */
  const redirects = [
    { from: '/projects/', to: '/blog/' },
    { from: '/jobs/', to: '/blog/' }
  ]
  const redirectOwners = new Map(redirects.map(({ from }) => [from, 'global data']))

  for (const [source, entry] of entries) {
    for (const redirect of entry.redirects) {
      const existingSource = redirectOwners.get(redirect.from)
      if (existingSource) {
        throw new Error(`redirectFrom "${redirect.from}" is declared by both "${existingSource}" and "${source}"`)
      }

      redirectOwners.set(redirect.from, source)
      redirects.push(redirect)
    }
  }

  return redirects
}

/**
 * @param {GlobalDataFunctionParams['pages'][number]} page
 * @returns {BlogPost | undefined}
 */
function collectBlogPost (page) {
  if (!['article', 'book-review'].includes(page.vars.layout) || page.vars.published === false) return undefined

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
    publishDate: publishDate.toISOString(),
    draft: page.pageInfo.draft
  }
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

/** @type {AsyncGlobalDataFunction<GlobalData, Record<string, any>, any, GlobalDataState>} */
export default async function globalData ({ pages, previousState, changes, setState }) {
  /** @type {GlobalDataState} */
  const entries = changes.kind === 'reset' || previousState === undefined
    ? new Map()
    : new Map(previousState)

  const pagesBySourceId = new Map(pages.map(page => [page.sourceId, page]))
  const changedSourceIds = new Set()

  if (changes.kind === 'reset' || previousState === undefined) {
    for (const page of pages) {
      entries.set(page.sourceId, collectEntry(page))
      changedSourceIds.add(page.sourceId)
    }
  } else {
    for (const sourceId of changes.removed) entries.delete(sourceId)
    for (const page of changes.upserted) {
      entries.set(page.sourceId, collectEntry(page))
      changedSourceIds.add(page.sourceId)
    }
  }

  const blogPosts = [...entries.values()]
    .flatMap(entry => entry.blogPost ? [entry.blogPost] : [])
    .sort((a, b) => b.publishDate.localeCompare(a.publishDate))
  const blogIndexes = collectBlogIndexes(blogPosts)
  const redirects = collectRedirects(entries)
  const feedPosts = await pMap(blogPosts.slice(0, 10), async post => {
    const sourceId = [...entries].find(([, entry]) => entry.blogPost?.path === post.path)?.[0]
    const entry = sourceId ? entries.get(sourceId) : undefined
    const page = sourceId ? pagesBySourceId.get(sourceId) : undefined
    if (!entry || !page) throw new Error(`Unable to render feed post "${post.path}"`)
    if (!entry.feedPost || changedSourceIds.has(sourceId)) {
      entry.feedPost = { ...post, contentHtml: String(await page.renderInnerPage()) }
    }
    return entry.feedPost
  }, { concurrency: 4 })
  const sitemapUrls = [...entries.values()]
    .filter(entry => !entry.noindex)
    .map(entry => entry.url)

  setState(entries)
  return {
    blogPosts,
    blogIndexes,
    redirects,
    feedPosts,
    sitemapUrls,
    recentBlogPosts: blogPosts.slice(0, 5),
    blogPostsHtml: renderBlogIndexList(blogPosts.slice(0, 5), { more: true })
  }
}
