import { html, render } from 'uhtml-isomorphic'
import { renderBlogIndexList } from './components/blog-index-list/index.js'

/** @import { PagesFunction } from '@domstack/static/types.js' */

/** @typedef {{ path: string, url: string, title: string, publishDate: string }} BlogPost */
/** @typedef {{ year: number, posts: BlogPost[] }} BlogIndex */
/** @typedef {{ blogPosts: BlogPost[], blogIndexes: BlogIndex[] }} BlogData */

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

/** @type {PagesFunction<Record<string, any>, string, BlogData>} */
export default function blogPages ({ vars }) {
  const blogPosts = vars.blogPosts ?? []
  const blogIndexes = vars.blogIndexes ?? []

  return [
    {
      outputName: 'blog/index.html',
      vars: {
        title: 'Blog Posts',
        layout: 'blog-index',
        noindex: true
      },
      children: `${renderBlogIndexList(blogPosts)}${renderArchiveLinks(blogIndexes)}`
    },
    ...blogIndexes.map(({ year, posts }) => ({
      outputName: `blog/${year}/index.html`,
      vars: {
        title: `${year} Blog Posts`,
        layout: 'blog-index',
        noindex: true
      },
      children: renderBlogIndexList(posts)
    }))
  ]
}
