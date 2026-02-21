/**
 * @template T
 * @typedef {import('@domstack/static').PageFunction<T>} PageFunction
 */

export const vars = {
  title: 'Projects',
  layout: 'blog-auto-index',
  noindex: true
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
