import PhotoSwipeLightbox from 'photoswipe/lightbox'
// @ts-expect-error
import PhotoSwipeDynamicCaption from 'photoswipe-dynamic-caption-plugin'

const lightbox = new PhotoSwipeLightbox({
  gallery: '.article-layout',
  children: 'a.imageSwipe',
  pswpModule: () => import('photoswipe'),
})

// Attach dynamic caption plugin
// eslint-disable-next-line no-new
new PhotoSwipeDynamicCaption(lightbox, {
  type: 'auto', // positions below or beside image based on space
  captionContent: (/** @type {{ data: { element: { closest: (arg0: string) => { (): any; new (): any; querySelector: { (arg0: string): any; new (): any; }; }; querySelector: (arg0: string) => { (): any; new (): any; getAttribute: { (arg0: string): any; new (): any; }; }; }; }; }} */ slide) => {
    // Prefer figcaption text, fallback to alt
    const figcaption = slide.data.element.closest('figure')?.querySelector('figcaption')
    return figcaption?.textContent || slide.data.element.querySelector('img')?.getAttribute('alt') || ''
  }
})

lightbox.init()
