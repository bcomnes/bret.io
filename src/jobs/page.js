/**
 * @template T
 * @typedef {import('@siteup/cli').PageFunction<T>} PageFunction
 */

export const vars = {
  title: 'Jobs',
  layout: 'blog-auto-index'
}

/**
 * @type {PageFunction<{
 *       title: string
 *       publishDate: string
 * }>}
 */
export default async function jobsIndex () {
  return ''
}
