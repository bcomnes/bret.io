import jsonfeedToAtom from 'jsonfeed-to-atom'
import { parseFragment } from 'parse5'
import { escapeAttribute } from 'entities'

/** @import { DataDeps, TemplateAsyncIterator } from '@domstack/static/types.js' */
/** @import { FeedData } from './global.data.js' */
/** @import { JsonFeed } from 'jsonfeed-to-atom' */
/** @import { DefaultTreeAdapterTypes } from 'parse5' */

/**
 * @param {string} url
 * @param {string} baseUrl
 */
function absoluteUrl (url, baseUrl) {
  if (/^[a-z][a-z\d+.-]*:/i.test(url.trim())) return url
  return new URL(url, baseUrl).href
}

/**
 * @param {string} srcset
 * @param {string} baseUrl
 */
function absoluteSrcset (srcset, baseUrl) {
  let output = ''
  let position = 0
  while (position < srcset.length) {
    const separators = /^[\t\n\f\r ,]*/.exec(srcset.slice(position))?.[0] ?? ''
    output += separators
    position += separators.length
    const token = /^[^\t\n\f\r ]+/.exec(srcset.slice(position))?.[0]
    if (!token) break
    position += token.length

    // A URL may contain commas (including data URLs); only trailing commas end it.
    const url = token.replace(/,+$/, '')
    output += absoluteUrl(url, baseUrl) + token.slice(url.length)
    if (url.length !== token.length) continue

    const start = position
    let parentheses = 0
    while (position < srcset.length) {
      const char = srcset[position++]
      if (char === '(') parentheses++
      if (char === ')') parentheses = Math.max(0, parentheses - 1)
      if (char === ',' && parentheses === 0) break
    }
    output += srcset.slice(start, position)
  }
  return output
}

/**
 * Resolve article-relative media and links against the article, not the feed URL.
 * @param {string} content
 * @param {string} baseUrl
 * @returns {string}
 */
export function absoluteHtmlUrls (content, baseUrl) {
  const fragment = parseFragment(content, { sourceCodeLocationInfo: true })
  /** @type {{ start: number, end: number, value: string }[]} */
  const replacements = []

  /** @param {DefaultTreeAdapterTypes.Node} node */
  function visit (node) {
    if ('attrs' in node) {
      for (const attribute of node.attrs) {
        if (!['href', 'src', 'poster', 'srcset'].includes(attribute.name)) continue
        const location = node.sourceCodeLocation?.attrs?.[attribute.name]
        if (!location) continue
        const value = attribute.name === 'srcset'
          ? absoluteSrcset(attribute.value, baseUrl)
          : absoluteUrl(attribute.value, baseUrl)
        if (value === attribute.value) continue
        replacements.push({
          start: location.startOffset,
          end: location.endOffset,
          value: `${attribute.name}="${escapeAttribute(value)}"`
        })
      }
    }
    if ('childNodes' in node) node.childNodes.forEach(visit)
    if ('content' in node) visit(node.content)
  }
  visit(fragment)

  // Patch attributes in place: reserializing the tree would change unrelated markup.
  for (const { start, end, value } of replacements.sort((a, b) => b.start - a.start)) {
    content = content.slice(0, start) + value + content.slice(end)
  }
  return content
}

/** @satisfies {DataDeps<FeedData>} */
export const dataDeps = ['feedPosts']

/** @type {TemplateAsyncIterator<{
 *  siteName: string,
 *  description: string,
 *  siteUrl: string,
 *  authorName: string,
 *  authorUrl: string,
 *  authorImgUrl: string
 *  layout: string,
 *  publishDate: string,
 *  title: string
 * }, FeedData>} */
export default async function * feedsTemplate ({
  vars: {
    siteName,
    description,
    siteUrl,
    authorName,
    authorUrl,
    authorImgUrl
  },
  data: { feedPosts }
}) {
  /** @satisfies {JsonFeed} */
  const jsonFeed = {
    version: 'https://jsonfeed.org/version/1',
    title: siteName,
    home_page_url: siteUrl,
    feed_url: new URL('/feed.json', siteUrl).href,
    description,
    author: {
      name: authorName,
      url: authorUrl,
      avatar: authorImgUrl
    },
    items: feedPosts.map(post => {
      const url = new URL(post.url, siteUrl).href
      return {
        date_published: post.publishDate,
        title: post.title,
        url,
        id: `${url}#${post.publishDate}`,
        content_html: absoluteHtmlUrls(post.contentHtml, url)
      }
    })
  }

  yield {
    content: JSON.stringify(jsonFeed, null, '  '),
    outputName: 'feed.json'
  }

  const atom = jsonfeedToAtom(jsonFeed)

  yield {
    content: atom,
    outputName: 'feed.xml'
  }

  yield {
    content: atom,
    outputName: 'atom.xml'
  }
}
