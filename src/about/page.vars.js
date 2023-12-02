import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
const __dirname = import.meta.dirname

export default async () => {
  const pkg = await readFile(join(__dirname, '../../package.json'))

  return {
    pkg
  }
}
