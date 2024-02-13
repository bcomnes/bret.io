/**
 * @template T
 * @typedef {import('top-bun').TemplateFunction<T>} TemplateFunction
 */

/** @type {TemplateFunction<{
 *  siteName: string,
 *  description: string,
 *  siteUrl: string,
 *  authorName: string,
 *  authorUrl: string,
 *  authorImgUrl: string
 *  layout: string,
 *  publishDate: string
 *  title: string
 * }>} */
export default async ({
  vars: {
    siteUrl
  }
}) => `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`
