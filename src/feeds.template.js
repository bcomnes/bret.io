import pMap from 'p-map'
import jsonfeedToAtom from 'jsonfeed-to-atom'

/**
 * @param {string} content
 * @param {string} baseUrl
 * @returns {string}
 */
export function absoluteHtmlUrls (content, baseUrl) {
  return content
    .replace(/(\s(?:href|src|poster)=)(["'])(.*?)\2/gi, (match, prefix, quote, url) => {
      if (/^(?:data|javascript):/i.test(url)) return match
      return `${prefix}${quote}${new URL(url, baseUrl).href}${quote}`
    })
    .replace(/(\ssrcset=)(["'])(.*?)\2/gi, (match, prefix, quote, srcset) => {
      if (/^\s*data:/i.test(srcset)) return match
      const absoluteSrcset = srcset.split(',').map((/** @type {string} */ candidate) => {
        const [, url, descriptor = ''] = candidate.trim().match(/^(\S+)(.*)$/) ?? []
        return url ? `${new URL(url, baseUrl).href}${descriptor}` : candidate
      }).join(', ')
      return `${prefix}${quote}${absoluteSrcset}${quote}`
    })
}

/** @import { TemplateAsyncIterator } from '@domstack/static' */

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
 * }>} */
export default async function * feedsTemplate ({
  vars: {
    siteName,
    description,
    siteUrl,
    authorName,
    authorUrl,
    authorImgUrl
  },
  pages
}) {
  const blogPosts = pages
    .filter(page => ['article', 'book-review'].includes(page.vars.layout))
    .sort((a, b) => Date.parse(b.vars.publishDate) - Date.parse(a.vars.publishDate))
    .slice(0, 10)

  const jsonFeed = {
    version: 'https://jsonfeed.org/version/1',
    title: siteName,
    home_page_url: siteUrl,
    feed_url: `${siteUrl}/feed.json`,
    description,
    author: {
      name: authorName,
      url: authorUrl,
      avatar: authorImgUrl
    },
    items: await pMap(blogPosts, async (page) => {
      const url = `${siteUrl}/${page.pageInfo.path}/`
      return {
        date_published: page.vars.publishDate,
        title: page.vars.title,
        url,
        id: `${url}#${page.vars.publishDate}`,
        content_html: absoluteHtmlUrls(await page.renderInnerPage({ pages }), url)
      }
    }, { concurrency: 4 })
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
