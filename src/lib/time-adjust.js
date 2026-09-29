/**
 * time-adjust.js
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
 * @param {string}  [options.selector='time[data-localise]']
 * @param {Intl.DateTimeFormatOptions} [options.format]
 */
export function localiseTimes (options = {}) {
  const {
    selector = 'time[data-localise]',
    format = { dateStyle: 'medium', timeStyle: 'short' }
  } = options

  document.querySelectorAll(selector).forEach(el => {
    const iso = el.getAttribute('datetime')
    if (!iso) return

    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return

    if (el.getAttribute('data-localise') === 'date') {
      const parts = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).formatToParts(date)
      const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]))
      el.textContent = `${values['year']}-${values['month']}-${values['day']}`
      return
    }

    // Date-only values represent a calendar date, not an instant in time.
    if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
      el.textContent = iso
      return
    }

    el.textContent = new Intl.DateTimeFormat(undefined, format).format(date)
  })
}
