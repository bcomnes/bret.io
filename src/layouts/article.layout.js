import { html, raw } from 'fragtml'
import { sep } from 'node:path'
import { breadcrumb } from '#components/breadcrumb/index.js'

/** @import { LayoutFunction } from '@domstack/static/types.js' */
/** @import { HtmlResult } from 'fragtml/types.js' */
/** @import { LayoutChildren, RootLayoutVars } from './root.layout.js' */

/**
 * @typedef {RootLayoutVars & {
 *  title: string,
 *  articleType?: string,
 *  bodyType?: string,
 *  authorImgUrl?: string,
 *  authorImgAlt?: string,
 *  authorName?: string,
 *  authorUrl?: string,
 *  publishDate?: string,
 *  updatedDate?: string
 * }} ArticleLayoutVars
 */

export const parentLayout = 'root'

/** @type {LayoutFunction<ArticleLayoutVars, LayoutChildren, HtmlResult>} */
export default function articleLayout (args) {
  const { children } = args
  const vars = args.vars
  const pathSegments = args.page.path.split(sep)
  return html`
    ${breadcrumb({ pathSegments })}
    <article class="article-layout h-entry" itemscope itemtype="${vars.articleType ?? 'http://schema.org/BlogPosting'}">

      <header class="article-header">
        <h1 class="p-name article-title" itemprop="headline">${vars.title}</h1>
        <div class="metadata">
          <address class="author-info p-author h-card" itemprop="author" itemscope itemtype="http://schema.org/Person">
            ${vars.authorImgUrl
              ? html`<img height="40" width="40"  src="${vars.authorImgUrl}" alt="${vars.authorImgAlt}" class="u-photo" itemprop="image">`
              : null
            }
            ${vars.authorName && vars.authorUrl
              ? html`
                  <a href="${vars.authorUrl}" class="u-url" itemprop="url">
                    <span itemprop="p-name name">${vars.authorName}</span>
                  </a>`
              : null
            }
          </address>
          ${vars.publishDate
            ? html`
              <time class="published-date dt-published" itemprop="datePublished" datetime="${vars.publishDate}">
                <a href="#" class="u-url">
                  ${(new Date(vars.publishDate)).toLocaleString()}
                </a>
              </time>`
            : null
          }
          ${vars.updatedDate
            ? html`<time class="updated-date dt-updated" itemprop="dateModified" datetime="${vars.updatedDate}">Updated ${(new Date(vars.updatedDate)).toLocaleString()}</time>`
            : null
          }
        </div>
      </header>

      <section class="e-content" itemprop="${vars.bodyType ?? 'articleBody'}">
        ${typeof children === 'string' ? raw(children) : children}
      </section>

    <!--
    <footer>

    </footer>
    -->

    </article>

    <hr/>
    <giscus-widget
      id="comments"
      repo="bcomnes/bret.io"
      repoid="MDEwOlJlcG9zaXRvcnk3MjgwNzcxMg=="
      category="Announcements"
      categoryid="DIC_kwDOBFb1IM4CN-FH"
      mapping="og:title"
      strict="0"
      reactionsenabled="1"
      emitmetadata="0"
      inputposition="top"
      theme="preferred_color_scheme"
      lang="en"
      loading="lazy"
    ></giscus-widget>
    ${breadcrumb({ pathSegments })}
  `
}
