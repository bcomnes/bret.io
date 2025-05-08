/**
 * localise-times.js
 *
 * Re-writes every <time class="dt-published"> element so the text shows
 * the reader’s local date-and-time instead of UTC.
 *
 * Usage:
 *   import { localiseTimes } from './localise-times.js'
 *   localiseTimes()                 // run once after the page renders
 *
 *   // or customise:
 *   localiseTimes({
 *     selector: 'time[data-localise]',      // any CSS selector
 *     format: { dateStyle: 'long', timeStyle: 'medium' } // Intl options
 *   })
 */

/**
 * @param {object}  [options]
 * @param {string}  [options.selector='.dt-published']
 * @param {Intl.DateTimeFormatOptions} [options.format]
 */
export function localiseTimes (options = {}) {
  if (!('Temporal' in window)) return   // fall back to UTC when unsupported

  const {
    selector = 'time.dt-published',
    format = { dateStyle: 'medium', timeStyle: 'short' }
  } = options

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone

  document.querySelectorAll(selector).forEach(el => {
    const iso = el.getAttribute('datetime')
    if (!iso) return

    // @ts-ignore
    // eslint-disable-next-line no-undef
    const instant = Temporal.Instant.from(iso)
    const zoned = instant.toZonedDateTimeISO(tz)

    el.textContent = zoned.toLocaleString(undefined, format)
  })
}
