import { html } from 'uhtml-isomorphic'
import { sep } from 'node:path'
import cn from 'classnames'
import { breadcrumb } from '../components/breadcrumb/index.js'

import defaultRootLayout from './root.layout.js'

export default function articleLayout (args) {
  const { children, ...rest } = args
  const vars = args.vars
  const pathSegments = args.page.path.split(sep)
  const wrappedChildren = html`
    ${breadcrumb({ pathSegments })}
    <article class="${cn(['article-layout', 'h-entry', { 'article-serif': vars.serif }])}" itemscope itemtype="http://schema.org/NewsArticle">
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
            ? html`<time class="dt-updated" itemprop="dateModified" datetime="${vars.updatedDate}">Updated ${(new Date(vars.updatedDate)).toLocaleString()}</time>`
            : null
          }
        </div>
      </header>

      <section class="e-content" itemprop="articleBody">
        ${typeof children === 'string'
          ? html([children])
          : children /* Support both uhtml and string children. Optional. */
        }
      </section>

      <!--
        <footer>
            <p>Footer notes or related info here...</p>
        </footer>
      -->
    </article>
    ${breadcrumb({ pathSegments })}
  `

  return defaultRootLayout({ children: wrappedChildren, ...rest })
}
