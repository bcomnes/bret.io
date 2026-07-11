import { html } from 'uhtml-isomorphic'
import cn from 'classnames'

/**
 * @param {{ pathSegments: string[], label?: string }} options
 */
export const breadcrumb = ({
  pathSegments,
  label = 'Breadcrumb'
}) => {
  return html`
  <nav class="breadcrumb-nav" aria-label="${label}">
        <ol class="list">
            ${pathSegments.map((segment, i, segments) =>
              html`
                <li class="${cn({ item: true, active: segments.length - 1 === i })}">
                  <a href="${generateRelativePathSegment(segment, i, segments.length)}">${segment}</a>
                </li>`
            )}
        </ol>
    </nav>
  `
}

const relativePathSegment = '../'

/**
 * @param {string} segment
 * @param {number} index
 * @param {number} segmentLength
 */
function generateRelativePathSegment (segment, index, segmentLength) {
  const segmentCount = segmentLength - index
  if (index === segmentLength - 1) return './'
  const segments = []
  for (let i = 0; i < segmentCount; i++) {
    segments.push(relativePathSegment)
  }
  segments.push(segment.endsWith('.html') ? segment : `${segment}/`)
  return segments.join('')
}
