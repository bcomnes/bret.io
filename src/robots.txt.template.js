/**
 * @template T
 * @typedef {import('@domstack/static').TemplateFunction<T>} TemplateFunction
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

Content-Signal: ai-train=yes, search=yes, ai-input=yes
`
