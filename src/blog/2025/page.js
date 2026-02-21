/**
 * @template T
 * @typedef {import('@domstack/static').PageFunction<T>} PageFunction
 */

export const vars = {
  title: '2025 Blog Posts',
  layout: 'blog-auto-index',
  noindex: true
}

/**
 * @type {PageFunction<{
 *       title: string
 *       publishDate: string
 * }>}
 */
export default async function blogIndex2023 () {
  return ''
}
