/** @import { BuildOptions } from '@domstack/static/types.js' */

/**
 * @param {BuildOptions} settings
 * @returns {BuildOptions}
 */
export default function esbuildSettings (settings) {
  return {
    ...settings,
    target: ['es2024']
  }
}
