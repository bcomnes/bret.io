import { html, render } from 'fragtml'

/**
 * @typedef {object} BlogPost
 * @property {string} url
 * @property {string} title
 * @property {string} publishDate
 * @property {boolean} [draft]
 */

/**
 * @typedef {object} BlogIndexListOptions
 * @property {boolean} [more]
 * @property {boolean} [yearSeparators]
 */

/**
 * @param {BlogPost[]} posts
 * @param {BlogIndexListOptions} [options]
 * @returns {string}
 */
export function renderBlogIndexList (posts, { more = false, yearSeparators = false } = {}) {
  /** @type {number | undefined} */
  let previousYear

  return render(html`<ul class="blog-index-list">
    ${posts.map(post => {
      const publishDate = new Date(post.publishDate)
      const year = publishDate.getUTCFullYear()
      const separatorYear = yearSeparators && year !== previousYear ? year : null
      previousYear = year

      return html`
        <li class="blog-entry h-entry" ${separatorYear === null ? null : html`data-year="${separatorYear}"`}>
          <span class="blog-entry-title">
            <a class="blog-entry-link u-url u-uid p-name" href="${post.url}">${post.title}</a>
            ${post.draft ? html`<span class="blog-entry-draft draft-badge">Draft</span>` : null}
          </span>
          <time class="blog-entry-date dt-published" datetime="${publishDate.toISOString()}">
            ${publishDate.toISOString().split('T')[0]}
          </time>
        </li>`
    })}
    ${more ? html`<li class="blog-entry"><a href="/blog/">More...</a></li>` : null}
  </ul>`)
}
