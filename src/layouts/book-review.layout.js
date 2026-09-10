import { html, raw } from 'fragtml'

/** @import { LayoutFunction, LayoutVars } from '@domstack/static/types.js' */
/** @import { HtmlResult } from 'fragtml/types.js' */
/** @import { LayoutChildren } from './root.layout.js' */
/** @import { ArticleLayoutVars } from './article.layout.js' */

/**
 * @typedef {ArticleLayoutVars & {
 *  book: {
 *    title: string,
 *    author: string,
 *    ISBN: string,
 *    ISBN13: string,
 *    OCLC: string,
 *    reference: Record<string, string>,
 *    publishDate: string,
 *    publisher: string
 *  },
 *  review: { rating: number }
 * }} BookReviewLayoutVars
 */

export const parentLayout = 'article'

/** @satisfies {LayoutVars<Partial<BookReviewLayoutVars>>} */
export const vars = {
  articleType: 'http://schema.org/Review',
  bodyType: 'description'
}

/** @type {LayoutFunction<BookReviewLayoutVars, LayoutChildren, HtmlResult>} */
export default function bookReviewLayout (args) {
  const { children } = args
  const vars = args.vars
  return html`
    ${typeof children === 'string' ? raw(children) : children}
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
              ([name, link]) => html`<li><a href="${link}">${name}</a></li>`
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
}
