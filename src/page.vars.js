import { html, render } from 'uhtml-isomorphic'

export default {
  title: null
}

export async function postVars ({
  pages
}) {
  const blogPosts = pages
    .filter(page => page.vars.layout === 'article')
    .sort((a, b) => new Date(b.vars.publishDate) - new Date(a.vars.publishDate))
    .slice(0, 5)

  const blogpostsHtml = render(String, html`<ul class="blog-index-list">
      ${blogPosts.map(p => {
        const publishDate = p.vars.publishDate ? new Date(p.vars.publishDate) : null
        return html`
          <li class="blog-entry h-entry">
            <a class="blog-entry-link u-url u-uid p-name" href="/${p.pageInfo.path}/">${p.vars.title}</a>
            ${
              publishDate
                ? html`<time class="blog-entry-date dt-published" datetime="${publishDate.toISOString()}">
                    ${publishDate.toISOString().split('T')[0]}
                  </time>`
                : null
            }
          </li>`
        })}
      <li class="blog-entry"><a href="/blog/">More...</a></li>
    </ul>`)

  const pageVars = {
    blogPostsHtml: blogpostsHtml
  }

  return pageVars
}
