import { html, render } from 'uhtml-isomorphic'
import { renderBlogIndexList } from './components/blog-index-list/index.js'

/** @import { DataDeps, PagesFunction } from '@domstack/static/types.js' */
/** @import { BlogData, BlogIndex } from './global.data.js' */

/** @satisfies {DataDeps<BlogData>} */
export const dataDeps = ['blogPosts', 'blogIndexes']

/** @param {BlogIndex[]} indexes */
function renderArchiveLinks (indexes) {
  return render(String, html`
    <footer class="blog-index-footer">
      <h4>Archive</h4>
      <ul class="archive-list">
        ${indexes.map(({ year }) => html`<li><a href="/blog/${year}/">${year}</a></li>`)}
      </ul>
    </footer>
  `)
}

/** @type {PagesFunction<Record<string, any>, string, Record<string, any>, BlogData>} */
export default function blogPages ({ data: { blogPosts, blogIndexes } }) {
  return [
    {
      outputName: 'blog/index.html',
      vars: {
        title: 'Blog Posts',
        layout: 'blog-index',
        noindex: true
      },
      children: `${renderBlogIndexList(blogPosts, { yearSeparators: true })}${renderArchiveLinks(blogIndexes)}`
    },
    ...blogIndexes.map(({ year, posts }) => ({
      outputName: `blog/${year}/index.html`,
      vars: {
        title: `${year} Blog Posts`,
        layout: 'blog-index',
        noindex: true
      },
      children: `${renderBlogIndexList(posts)}${renderArchiveLinks(blogIndexes)}`
    }))
  ]
}
