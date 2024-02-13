import { html } from 'uhtml-isomorphic'

import articleLayout from './article.layout.js'

export default function bookReviewLayout (args) {
  const { children, ...rest } = args
  const vars = args.vars
  const wrappedChildren = html`
    ${typeof children === 'string'
      ? html([children])
      : children /* Support both uhtml and string children. Optional. */
    }
    <footer>
      <h3 itemprop="reviewRating" itemscope="" itemtype="http://schema.org/Rating">
        Review
        <meta content="1" itemprop="worstRating">
        <meta content="${vars.review?.rating}" itemprop="ratingValue">
        <meta content="5" itemprop="bestRating">
        <div class="star-review" title="${vars.review?.rating}" >${Array.from({ length: vars.review?.rating }).fill('⭐️')}</div>
      </h3>

      <h3>Details</h3>
      <ul itemprop="itemReviewed" itemscope="" itemtype="http://schema.org/Book">
        <li>
            <span itemprop="name">${vars.book?.title}</span>
            ${' by '}
            <span itemprop="author" itemtype="https://schema.org/Person">
              ${vars.book?.author}
            </span>
        </li>
        <li>
          ${'ISBN: '}
          <span itemprop="isbn">
            ${vars.book?.ISBN}
          </span>
        </li>
        <li>
          ${'ISBN13: '}
          <span itemprop="isbn">
            ${vars.book?.ISBN13}
          </span>
        </li>
        <li>
          ${'OCLC: '}
          <span itemprop="oclc">
            ${vars.book?.OCLC}
          </span>
        </li>
        <li>${'Look up with:'}
          <ul>
            ${Object.entries(vars.book?.reference).map(
              ([name, link]) => html`<li><a href=${link}>${name}</a></li>`
            )}
          </ul>
        </li>
        <li>
          ${'Published: '}
          <span itemprop="datePublished">
            ${vars.book?.publishDate}
          </span>
        </li>
        <li>
          ${'Publisher: '}
          <span itemprop="publisher" itemtype="https://schema.org/Organization">
            ${vars.book?.publisher}
          </span>
        </li>
      </ul>
    </footer>
  `

  return articleLayout({
    children: wrappedChildren,
    articleType: 'http://schema.org/Review',
    bodyType: 'description',
    ...rest
  })
}
