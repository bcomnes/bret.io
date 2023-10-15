import pMap from 'p-map'
import jsonfeedToAtom from 'jsonfeed-to-atom'

export default async function * feedsTemplate (args) {
  const {
    vars: {
      siteName,
      siteDescription,
      siteUrl,
      authorName,
      authorUrl,
      authorImgUrl
    },
    pages
  } = args
  const blogPosts = pages
    .filter(page => page.vars.layout === 'article')
    .sort((a, b) => new Date(b.vars.publishDate) - new Date(a.vars.publishDate))
    .slice(0, 10)

  const jsonFeed = {
    version: 'https://jsonfeed.org/version/1',
    title: siteName,
    home_page_url: siteUrl,
    feed_url: `${siteUrl}/feed.json`,
    description: siteDescription,
    author: {
      name: authorName,
      url: authorUrl,
      avatar: authorImgUrl
    },
    items: await pMap(blogPosts, async (page) => {
      return {
        date_published: page.vars.publishDate,
        title: page.vars.title,
        url: `${siteUrl}/${page.page.path}/`,
        id: `${siteUrl}/${page.page.path}/#${page.vars.publishDate}`,
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
