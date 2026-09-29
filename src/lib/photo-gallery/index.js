import PhotoSwipeLightbox from 'photoswipe/lightbox'
// @ts-expect-error The caption plugin does not publish TypeScript declarations.
import PhotoSwipeDynamicCaption from 'photoswipe-dynamic-caption-plugin'

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const lightbox = new PhotoSwipeLightbox({
  gallery: '.photo-gallery',
  children: 'a.imageSwipe',
  pswpModule: () => import('photoswipe'),
  showHideAnimationType: reducedMotion ? 'none' : 'zoom',
  zoomAnimationDuration: reducedMotion ? 0 : 333
})

// eslint-disable-next-line no-new
new PhotoSwipeDynamicCaption(lightbox, {
  type: 'auto',
  captionContent: (/** @type {{ data: { element?: HTMLElement } }} */ slide) => {
    const element = slide.data.element
    const caption = element?.closest('figure')?.querySelector('figcaption')?.textContent
    const text = caption?.trim() || element?.querySelector('img')?.alt || ''
    // The plugin accepts HTML; keep historical captions and alt text inert.
    const container = document.createElement('span')
    container.textContent = text
    return container.innerHTML
  }
})

lightbox.init()
