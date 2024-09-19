import pMap from 'p-map'
import jsonfeedToAtom from 'jsonfeed-to-atom'

/**
 * @template T
 * @typedef {import('top-bun').TemplateAsyncIterator<T>} TemplateAsyncIterator
 */

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
    .sort((a, b) => new Date(b.vars.publishDate) - new Date(a.vars.publishDate))
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
      return {
        date_published: page.vars.publishDate,
        title: page.vars.title,
        url: `${siteUrl}/${page.pageInfo.path}/`,
        id: `${siteUrl}/${page.pageInfo.path}/#${page.vars.publishDate}`,
        content_html: await page.renderInnerPage({ pages })
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
