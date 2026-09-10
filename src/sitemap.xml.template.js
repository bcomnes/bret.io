import builder from 'xmlbuilder'

/** @import { DataDeps, TemplateFunction } from '@domstack/static/types.js' */
/** @import { SitemapData } from './global.data.js' */

/** @satisfies {DataDeps<SitemapData>} */
export const dataDeps = ['sitemapUrls']

/** @type {TemplateFunction<{
 *  siteName: string,
 *  description: string,
 *  siteUrl: string,
 *  authorName: string,
 *  authorUrl: string,
 *  authorImgUrl: string
 *  layout: string,
 *  publishDate: string
 *  title: string,
 *  noindex?: boolean
 * }, SitemapData>} */
export default async ({
  vars: {
    siteUrl
  },
  data: { sitemapUrls }
}) => {
  const sitemapObj = {
    urlset: {
      '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
      url: sitemapUrls.map(url => ({
        loc: `${siteUrl}${url}`
      }))
    }
  }
  const feed = builder.create(sitemapObj, { encoding: 'utf-8' })
  return feed.end({ pretty: true, allowEmpty: false })
}
