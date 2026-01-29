import Masonry from 'masonry-layout'

/**
 * @typedef {object} MasonryGridOptions
 * @property {string} [selector='.figure-grid']
 * @property {string} [itemSelector='figure']
 * @property {string} [sizerClass='masonry-sizer']
 * @property {string} [gutterClass='masonry-gutter']
 * @property {string} [activeClass='is-masonry']
 */

/**
 * @param {MasonryGridOptions} [options]
 * @returns {Masonry[]}
 */
export function setupMasonryGrids (options = {}) {
  if (typeof document === 'undefined') return []

  const {
    selector = '.figure-grid',
    itemSelector = 'figure',
    sizerClass = 'masonry-sizer',
    gutterClass = 'masonry-gutter',
    activeClass = 'is-masonry'
  } = options

  const grids = [...document.querySelectorAll(selector)]
  if (grids.length === 0) return []

  return grids.map((grid) => {
    let sizer = grid.querySelector(`:scope > .${sizerClass}`)
    if (!sizer) {
      sizer = document.createElement('div')
      sizer.className = sizerClass
      grid.insertBefore(sizer, grid.firstElementChild)
    }

    let gutter = grid.querySelector(`:scope > .${gutterClass}`)
    if (!gutter) {
      gutter = document.createElement('div')
      gutter.className = gutterClass
      grid.insertBefore(gutter, sizer.nextElementSibling)
    }

    grid.classList.add(activeClass)

    const masonry = new Masonry(grid, {
      itemSelector,
      columnWidth: `.${sizerClass}`,
      gutter: `.${gutterClass}`,
      percentPosition: true
    })

    const relayout = () => masonry.layout?.()
    const images = grid.querySelectorAll('img')

    images.forEach((img) => {
      if (img.complete && img.naturalWidth !== 0) return
      const decode = img.decode?.bind(img)
      if (decode) {
        decode().then(relayout).catch(relayout)
        return
      }
      img.addEventListener('load', relayout, { once: true })
      img.addEventListener('error', relayout, { once: true })
    })

    return masonry
  })
}

/**
 * @param {MasonryGridOptions} [options]
 * @returns {Masonry[]}
 */
export function initMasonryGrids (options = {}) {
  if (typeof document === 'undefined') return []
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupMasonryGrids(options)
    }, { once: true })
    return []
  }
  return setupMasonryGrids(options)
}
