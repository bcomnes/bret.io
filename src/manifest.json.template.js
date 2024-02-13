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
    siteName
  }
}) => {
  return JSON.stringify({
    manifest_version: 2,
    name: siteName,
    icons: [
      {
        src: '/favicons/apple-touch-icon-1024x1024.png',
        sizes: '1024x1024'
      }
    ],
    display: 'fullscreen'
  }, null, ' ')
}
