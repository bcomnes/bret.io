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
}) => {
  return JSON.stringify({
    origins: [siteUrl],
    originsRegex: ['http://localhost:[0-9]+']
  }, null, ' ')
}
