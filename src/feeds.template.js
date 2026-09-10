import jsonfeedToAtom from 'jsonfeed-to-atom'

/** @import { DataDeps, TemplateAsyncIterator } from '@domstack/static/types.js' */
/** @import { FeedData } from './global.data.js' */
/** @import { JsonFeed } from 'jsonfeed-to-atom' */

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
    feed_url: `${siteUrl}/feed.json`,
    description,
    author: {
      name: authorName,
      url: authorUrl,
      avatar: authorImgUrl
    },
    items: feedPosts.map(post => ({
      date_published: post.publishDate,
      title: post.title,
      url: `${siteUrl}${post.url}`,
      id: `${siteUrl}${post.url}#${post.publishDate}`,
      content_html: post.contentHtml
    }))
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
