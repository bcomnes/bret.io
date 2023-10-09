import { html } from 'uhtml-isomorphic'
import cn from 'classnames'

export const breadcrumb = ({
  pathSegments
}) => {
  return html`
  <nav class="breadcrumb-nav" aria-label="breadcrumb">
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
function generateRelativePathSegment (segment, index, segmentLength) {
  const segmentCount = segmentLength - index
  if (index === segmentLength - 1) return './'
  const segments = []
  for (let i = 0; i < segmentCount; i++) {
    segments.push(relativePathSegment)
  }
  segments.push(segment)
  return segments.join('')
}
