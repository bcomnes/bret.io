import test from 'node:test'
import assert from 'node:assert/strict'
import { testBuild } from '@domstack/static'

const movedPages = [
  ['projects/websockets/index.html', 'blog/2019/websockets/index.html', '/blog/2019/websockets/'],
  ['projects/package-automation/index.html', 'blog/2020/package-automation/index.html', '/blog/2020/package-automation/'],
  ['jobs/netlify/index.html', 'blog/2020/netlify/index.html', '/blog/2020/netlify/'],
  ['projects/tron-legacy-2021/index.html', 'blog/2021/tron-legacy-2021/index.html', '/blog/2021/tron-legacy-2021/'],
  ['jobs/littlstar/index.html', 'blog/2021/littlstar/index.html', '/blog/2021/littlstar/'],
  ['projects/previous-projects/index.html', 'blog/2023/previous-projects/index.html', '/blog/2023/previous-projects/']
] as const

function normalizeHtml (html: string) {
  // Full pages are pretty-printed; feed fragments retain the original formatting.
  return html
    .replace(/<[^>]+>/g, tag => tag.replace(/\s+>$/, '>'))
    .replace(/\s+<\/p>/g, '</p>')
    .replace(/>\s+</g, '><')
    .replace(/\s+/g, ' ')
    .trim()
}

function decodeXml (text: string) {
  const entities: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" }
  return text.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (_, entity: string) => {
    if (entity.startsWith('#x')) return String.fromCodePoint(parseInt(entity.slice(2), 16))
    if (entity.startsWith('#')) return String.fromCodePoint(Number(entity.slice(1)))
    return entities[entity]!
  })
}

function capture (text: string, pattern: RegExp, message: string) {
  const match = text.match(pattern)
  assert.ok(match, message)
  return match[1]!
}

test('labels draft posts in preview blog indexes', async (t) => {
  const build = await testBuild('./src', { buildDrafts: true })
  t.after(build.cleanup)

  const blogIndex = await build.readOutput('blog/index.html')
  const entries = [...blogIndex.matchAll(/<li class="blog-entry h-entry"[^>]*>([\s\S]*?)<\/li>/g)].map(match => match[1]!)
  const draftPages = build.results.siteData.pages.filter(page => page.draft)
  assert.ok(draftPages.length > 0, 'preview includes draft pages')

  for (const entry of entries) {
    const url = capture(entry, /href="([^"]+)"/, 'post has a link')
    const page = build.results.siteData.pages.find(page => page.url === url)
    assert.ok(page, `index entry ${url} has a source page`)
    assert.equal(entry.includes('<span class="blog-entry-draft draft-badge">Draft</span>'), page.draft, `${url} has the correct draft label`)
  }

  for (const page of draftPages) {
    const indexEntry = entries.find(entry => entry.includes(`href="${page.url}"`))
    assert.ok(indexEntry, `${page.url} appears in the preview index`)
    const publishDate = capture(indexEntry, /datetime="([^"]+)"/, 'draft entry has a publish date')
    const year = new Date(publishDate).getUTCFullYear()
    const archive = await build.readOutput(`blog/${year}/index.html`)
    const entry = [...archive.matchAll(/<li class="blog-entry h-entry"[^>]*>([\s\S]*?)<\/li>/g)]
      .map(match => match[1]!)
      .find(entry => entry.includes(`href="${page.url}"`))
    assert.ok(entry, `${page.url} appears in its yearly archive`)
    assert.match(entry, /<span class="blog-entry-draft draft-badge">Draft<\/span>/)
    const article = await build.readOutput(page.outputRelname)
    assert.equal([...article.matchAll(/<span class="draft-badge">Draft<\/span>/g)].length, 1, `${page.url} shows one matching page badge`)
    assert.doesNotMatch(article, /<div>DRAFT<\/div>|DRAFT POST/)
  }
})

test('builds homepage, feeds, sitemap, generated blog indexes and variable-driven redirects', async (t) => {
  const build = await testBuild('./src')
  t.after(build.cleanup)

  // Use source-backed output, not global data or another generated index, as the oracle.
  const sourcePages = await Promise.all(build.results.siteData.pages
    .filter(page => !page.generated && !page.draft)
    .map(async page => ({ ...page, html: await build.readOutput(page.outputRelname) })))
  const posts = sourcePages
    .filter(page => /<article class="article-layout\b/.test(page.html) && !page.html.includes('<span class="draft-badge">Draft</span>'))
    .map(page => ({
      ...page,
      title: decodeXml(capture(page.html, /<h1[^>]*class="[^"]*article-title[^"]*"[^>]*>([\s\S]*?)<\/h1>/, `${page.url} has a title`)).trim(),
      publishDate: new Date(capture(page.html, /<time[^>]*itemprop="datePublished"[^>]*datetime="([^"]+)"/, `${page.url} has a publish date`)).toISOString()
    }))
    .sort((a, b) => b.publishDate.localeCompare(a.publishDate))
  assert.ok(posts.length > 10, 'source posts exercise the ten-item feed limit')
  const years = [...new Set(posts.map(post => new Date(post.publishDate).getUTCFullYear()))]

  const homepage = await build.readOutput('index.html')
  const recentPosts = capture(homepage, /<div class="recent-post-container">([\s\S]*?)<\/div>/, 'homepage has a recent-post container')
  assert.match(recentPosts, /<ul class="blog-index-list">/, 'recent posts render as HTML, not escaped text')
  const recentLinks = [...recentPosts.matchAll(/<a class="blog-entry-link[^"]*" href="([^"]+)">([\s\S]*?)<\/a>/g)]
  assert.deepEqual(recentLinks.map(match => decodeXml(match[1]!)), posts.slice(0, 5).map(post => post.url))
  assert.deepEqual(recentLinks.map(match => decodeXml(match[2]!).trim()), posts.slice(0, 5).map(post => post.title))
  assert.deepEqual([...recentPosts.matchAll(/datetime="([^"]+)"/g)].map(match => match[1]), posts.slice(0, 5).map(post => post.publishDate))
  assert.match(recentPosts, /href="\/blog\/">More\.\.\.<\/a>/)
  assert.doesNotMatch(recentPosts, /\{\{\{|\[object (?:Object|Promise)\]/)

  const blogIndex = await build.readOutput('blog/index.html')
  assert.match(blogIndex, /Blog Posts/)
  assert.doesNotMatch(blogIndex, /class="blog-entry-draft draft-badge"/)
  assert.deepEqual(
    [...blogIndex.matchAll(/<li class="blog-entry h-entry" data-year="(\d+)">/g)].map(match => Number(match[1])),
    years,
    'blog index marks the start of each year for CSS separators'
  )
  assert.doesNotMatch(recentPosts, /data-year=/)
  for (const year of years) {
    assert.ok(blogIndex.includes(`href="/blog/${year}/"`))
    const archive = await build.readOutput(`blog/${year}/index.html`)
    assert.match(archive, new RegExp(`${year} Blog Posts`))
    assert.doesNotMatch(archive, /data-year=/)
    const archiveFooter = capture(archive, /<footer class="blog-index-footer">([\s\S]*?)<\/footer>/, `${year} has an archive footer`)
    assert.match(archiveFooter, /<h4>Archive<\/h4>/)
    assert.deepEqual(
      [...archiveFooter.matchAll(/href="\/blog\/(\d+)\/"/g)].map(match => Number(match[1])),
      years,
      `${year} links to every archive year in descending order`
    )
  }

  const feed = JSON.parse(await build.readOutput('feed.json')) as {
    version: string,
    home_page_url: string,
    feed_url: string,
    items: Array<{ id: string, url: string, title: string, date_published: string, content_html: string }>
  }
  assert.equal(feed.version, 'https://jsonfeed.org/version/1')
  assert.equal(feed.home_page_url, 'https://bret.io')
  assert.equal(feed.feed_url, 'https://bret.io/feed.json')
  assert.equal(feed.items.length, 10)
  assert.equal(new Set(feed.items.map(item => item.id)).size, 10, 'feed IDs are unique')
  assert.deepEqual(feed.items.map(item => item.url), posts.slice(0, 10).map(post => `https://bret.io${post.url}`))
  assert.deepEqual(feed.items.map(item => item.date_published), posts.slice(0, 10).map(post => post.publishDate))

  for (const [index, item] of feed.items.entries()) {
    const post = posts[index]!
    assert.equal(item.title, post.title)
    assert.equal(item.id, `${item.url}#${item.date_published}`)
    assert.equal(typeof item.content_html, 'string')
    assert.ok(item.content_html.replace(/<[^>]*>/g, '').trim(), `${item.url} has nonempty article text`)
    assert.match(item.content_html, /<(?:p|h[1-6]|ul|ol|blockquote)\b/, `${item.url} contains rendered HTML`)
    assert.doesNotMatch(item.content_html, /<!doctype|<html\b|\[object (?:Object|Promise)\]/i)
    assert.ok(normalizeHtml(post.html).includes(normalizeHtml(item.content_html)), `${item.url} feed content matches its rendered page`)
  }

  const feedXml = await build.readOutput('feed.xml')
  assert.equal(await build.readOutput('atom.xml'), feedXml, 'Atom endpoints serve the same feed')
  assert.match(feedXml, /<feed xmlns="http:\/\/www\.w3\.org\/2005\/Atom">/)
  const entries = [...feedXml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(match => match[1]!)
  assert.equal(entries.length, feed.items.length)
  for (const [index, entry] of entries.entries()) {
    const item = feed.items[index]!
    assert.equal(decodeXml(capture(entry, /<id>([\s\S]*?)<\/id>/, 'Atom entry has an ID')), item.id)
    assert.equal(decodeXml(capture(entry, /<title>([\s\S]*?)<\/title>/, 'Atom entry has a title')), item.title)
    assert.equal(decodeXml(capture(entry, /<link rel="alternate" href="([^"]+)"/, 'Atom entry has a canonical link')), item.url)
    assert.equal(capture(entry, /<published>([^<]+)<\/published>/, 'Atom entry has a publish date'), item.date_published)
    assert.equal(capture(entry, /<updated>([^<]+)<\/updated>/, 'Atom entry has an update date'), item.date_published)
    const content = capture(entry, /<content type="html">([\s\S]*?)<\/content>/, 'Atom entry has HTML content')
    const html = content.startsWith('<![CDATA[')
      ? content.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
      : decodeXml(content)
    assert.equal(html, item.content_html, `${item.url} has the same content in JSON and Atom`)
  }

  for (const [legacyOutput, canonicalOutput, canonicalUrl] of movedPages) {
    const redirect = await build.readOutput(legacyOutput)
    assert.match(redirect, /<meta name="robots" content="noindex">/)
    assert.match(redirect, new RegExp(`<meta http-equiv="refresh" content="0;url=${canonicalUrl}">`))
    assert.match(redirect, new RegExp(`<link rel="canonical" href="${canonicalUrl}">`))

    const canonical = await build.readOutput(canonicalOutput)
    assert.match(canonical, /<article class="article-layout/)
  }

  for (const legacyIndex of ['projects/index.html', 'jobs/index.html']) {
    const redirect = await build.readOutput(legacyIndex)
    assert.match(redirect, /<meta http-equiv="refresh" content="0;url=\/blog\/">/)
    assert.match(redirect, /<link rel="canonical" href="\/blog\/">/)
  }

  const resumeRedirect = await build.readOutput('cv/index.html')
  assert.match(resumeRedirect, /<meta name="robots" content="noindex">/)
  assert.match(resumeRedirect, /<meta http-equiv="refresh" content="0;url=\/resume\/">/)
  assert.match(resumeRedirect, /<link rel="canonical" href="\/resume\/">/)
  assert.match(await build.readOutput('resume/index.html'), /Bret Comnes Resume/)

  const sitemap = await build.readOutput('sitemap.xml')
  assert.match(sitemap, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/)
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => decodeXml(match[1]!))
  assert.equal(new Set(sitemapUrls).size, sitemapUrls.length, 'sitemap URLs are unique')
  assert.ok(sitemapUrls.includes('https://bret.io/'), 'sitemap includes the root URL')
  assert.ok(!sitemapUrls.includes('https://bret.io//'), 'root URL has no doubled slash')
  for (const page of sourcePages.filter(page => !/<meta name="robots" content="noindex">/.test(page.html))) {
    assert.ok(sitemapUrls.includes(`https://bret.io${page.url}`), `sitemap includes source page ${page.url}`)
  }
  for (const path of ['/blog/', ...years.map(year => `/blog/${year}/`)]) {
    assert.ok(!sitemapUrls.includes(`https://bret.io${path}`), `sitemap excludes generated archive ${path}`)
  }
  for (const [legacyOutput, , canonicalUrl] of movedPages) {
    const legacyUrl = `/${legacyOutput.replace(/index\.html$/, '')}`
    assert.doesNotMatch(sitemap, new RegExp(`<loc>https://bret\\.io${legacyUrl}</loc>`))
    assert.match(sitemap, new RegExp(`<loc>https://bret\\.io${canonicalUrl}</loc>`))
  }
  assert.doesNotMatch(sitemap, /<loc>https:\/\/bret\.io\/(?:projects|jobs|cv)\/<\/loc>/)
  assert.match(sitemap, /<loc>https:\/\/bret\.io\/resume\/<\/loc>/)
})
