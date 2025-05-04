import PhotoSwipeLightbox from 'photoswipe/lightbox'
import PhotoSwipeDynamicCaption from 'photoswipe-dynamic-caption-plugin'

const lightbox = new PhotoSwipeLightbox({
  gallery: '.article-layout',
  children: 'a.imageSwipe',
  pswpModule: () => import('photoswipe'),
})

// Attach dynamic caption plugin
const captionPlugin = new PhotoSwipeDynamicCaption(lightbox, {
  type: 'auto', // positions below or beside image based on space
  captionContent: (slide) => {
    // Prefer figcaption text, fallback to alt
    const figcaption = slide.data.element.closest('figure')?.querySelector('figcaption')
    return figcaption?.textContent || slide.data.element.querySelector('img')?.getAttribute('alt') || ''
  }
})

lightbox.init()
