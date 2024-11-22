import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const args = parseArgs({
  allowPositionals: true
})

const slug = args.positionals[0]
if (!slug) {
  console.error('Please provide the slug of the blog post.')
  process.exit(1)
}

const currentYear = new Date().getFullYear()
const readmeDraftPath = path.join(__dirname, '../src', 'blog', currentYear.toString(), slug, 'README.draft.md')
const readmePath = path.join(__dirname, '../src', 'blog', currentYear.toString(), slug, 'README.md')

try {
  let content = await fs.readFile(readmeDraftPath, 'utf8')
  const newPublishDate = new Date().toISOString()
  content = content.replace(/publishDate: ".*"/, `publishDate: "${newPublishDate}"`)

  await fs.writeFile(readmeDraftPath, content, 'utf8')
  await fs.rename(readmeDraftPath, readmePath)

  console.log(`Draft published and renamed to ${readmePath}`)
} catch (error) {
  console.error('Error processing the draft:', error)
  process.exit(1)
}
