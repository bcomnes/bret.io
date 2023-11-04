/**
 * @template T
 * @typedef {import('@siteup/cli').PageFunction<T>} PageFunction
 */

export const vars = {
  title: 'Projects',
  layout: 'blog-auto-index'
}

/**
 * @type {PageFunction<{
 *       title: string
 *       publishDate: string
 * }>}
 */
export default async function projectIndex () {
  return ''
}
