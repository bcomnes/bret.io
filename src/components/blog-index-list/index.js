import { html, render } from 'uhtml-isomorphic'

/** @typedef {{ url: string, title: string, publishDate: string }} BlogPost */

/**
 * @param {BlogPost[]} posts
 * @param {{ more?: boolean }} [options]
 */
export function renderBlogIndexList (posts, { more = false } = {}) {
  return render(String, html`<ul class="blog-index-list">
    ${posts.map(post => {
      const publishDate = new Date(post.publishDate)
      return html`
        <li class="blog-entry h-entry">
          <a class="blog-entry-link u-url u-uid p-name" href="${post.url}">${post.title}</a>
          <time class="blog-entry-date dt-published" datetime="${publishDate.toISOString()}">
            ${publishDate.toISOString().split('T')[0]}
          </time>
        </li>`
    })}
    ${more ? html`<li class="blog-entry"><a href="/blog/">More...</a></li>` : null}
  </ul>`)
}
