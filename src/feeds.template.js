import pMap from 'p-map'
import jsonfeedToAtom from 'jsonfeed-to-atom'

/** @import { TemplateAsyncIterator } from '@domstack/static/types.js' */

/** @type {TemplateAsyncIterator<{
 *  siteName: string,
 *  description: string,
 *  siteUrl: string,
 *  authorName: string,
 *  authorUrl: string,
 *  authorImgUrl: string
 *  layout: string,
 *  publishDate: string,
 *  title: string,
 *  blogPosts: Array<{ path: string, url: string, title: string, publishDate: string }>
 * }>} */
export default async function * feedsTemplate ({
  vars: {
    siteName,
    description,
    siteUrl,
    authorName,
    authorUrl,
    authorImgUrl,
    blogPosts
  },
  pages
}) {
  const feedPosts = blogPosts.slice(0, 10)

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
    items: await pMap(feedPosts, async (post) => {
      const page = pages.find(candidate => candidate.pageInfo.path === post.path)
      if (!page) throw new Error(`Unable to render feed post "${post.path}"`)

      return {
        date_published: post.publishDate,
        title: post.title,
        url: `${siteUrl}${post.url}`,
        id: `${siteUrl}${post.url}#${post.publishDate}`,
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
