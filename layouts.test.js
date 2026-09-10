import test from 'node:test'
import assert from 'node:assert/strict'
import { html, render } from 'fragtml'
import rootLayout from './src/layouts/root.layout.js'
import articleLayout, { parentLayout as articleParent } from './src/layouts/article.layout.js'
import bookReviewLayout, { parentLayout as bookParent, vars as bookDefaults } from './src/layouts/book-review.layout.js'
import blogIndexLayout, { parentLayout as blogParent } from './src/layouts/blog-index.layout.js'
import redirectLayout, { parentLayout as redirectParent, vars as redirectDefaults } from './src/layouts/redirect.layout.js'
import globalVars from './src/globals/global.vars.js'
import blogPages from './src/blog.pages.js'
import { renderBlogIndexList } from './src/components/blog-index-list/index.js'

const defaults = await globalVars()

function args (vars = {}, children = '<p>Rendered page content</p>', path = 'blog/example') {
  return {
    vars: { ...defaults, title: 'Example', ...vars },
    children,
    page: { path, pageFile: { relname: 'page.html' } },
    data: {},
    scripts: ['/client.js'],
    styles: ['/style.css']
  }
}

test('layouts declare their parent chains and defaults', () => {
  assert.equal(articleParent, 'root')
  assert.equal(blogParent, 'root')
  assert.equal(redirectParent, 'root')
  assert.equal(bookParent, 'article')
  assert.equal(bookDefaults.articleType, 'http://schema.org/Review')
  assert.equal(bookDefaults.bodyType, 'description')
  assert.equal(redirectDefaults.noindex, true)
})

test('root preserves trusted child HTML and escapes ordinary substitutions', async () => {
  const content = '<pre>first\n  second\n</pre>'
  const output = render(await rootLayout(args({ title: '<script>alert("x")</script>' }, content)))
  assert.ok(output.includes(content), 'preformatted child content is unchanged')
  assert.match(output, /<title>&lt;script&gt;alert\(&quot;x&quot;\)&lt;\/script&gt; \| bret\.io<\/title>/)
  assert.doesNotMatch(output, /<script>alert|&lt;pre&gt;|\[object Object\]/)
  assert.match(output, /<link rel="stylesheet" href="\/style\.css">/)
  assert.match(output, /<script src="\/client\.js" type='module'><\/script>/)
  assert.match(output, /class="markdown-body mine-layout"/)

  const nested = render(await rootLayout(args({}, html`<p>${'<unsafe>'}</p>`)))
  assert.match(nested, /<p>&lt;unsafe&gt;<\/p>/)
  assert.doesNotMatch(nested, /&amp;lt;unsafe/)
})

test('root emits correct homepage, nested, and HTML-file URLs', async () => {
  for (const siteUrl of ['https://bret.io', 'https://bret.io/']) {
    for (const [path, expected] of [
      ['', 'https://bret.io/'],
      ['blog/example', 'https://bret.io/blog/example/'],
      ['example.html', 'https://bret.io/example.html']
    ]) {
      const output = render(await rootLayout(args({ siteUrl }, '', path)))
      assert.ok(output.includes(`<meta property="og:url" content="${expected}">`))
    }
  }
})

test('book review nests through article and root without escaping or duplicating wrappers', async () => {
  const context = args({
    ...bookDefaults,
    title: 'Book <review>',
    book: {
      title: 'A <book>',
      author: 'An Author',
      ISBN: '1732265178',
      ISBN13: '9781732265172',
      OCLC: '1227304365',
      reference: { 'Book <link>': 'https://example.com/?q="book"&x=1' },
      publishDate: '2020',
      publisher: 'A Publisher'
    },
    review: { rating: 4 },
    publishDate: '2024-02-13T18:24:49.707Z'
  })
  const review = bookReviewLayout(context)
  const article = articleLayout({ ...context, children: review })
  const output = render(await rootLayout({ ...context, children: article }))
  assert.equal((output.match(/<html\b/g) ?? []).length, 1)
  assert.equal((output.match(/<article\b/g) ?? []).length, 1)
  assert.equal((output.match(/<giscus-widget\b/g) ?? []).length, 1)
  assert.match(output, /itemtype="http:\/\/schema\.org\/Review"/)
  assert.match(output, /<section class="e-content" itemprop="description">/)
  assert.match(output, /<p>Rendered page content<\/p>/)
  assert.match(output, /<span itemprop="name">A &lt;book&gt;<\/span>/)
  assert.match(output, /href="https:\/\/example\.com\/\?q=&quot;book&quot;&amp;x=1"/)
  assert.match(output, /<meta content="4" itemprop="ratingValue">/)
  assert.equal((output.match(/⭐️/gu) ?? []).length, 4)
  assert.doesNotMatch(output, /&lt;article|&lt;footer|\[object Object\]/)
})

test('blog lists preserve year separators, draft badges, and escaped attributes', () => {
  const posts = [
    { url: '/blog/?q="x"&a=1', title: '<script>title</script>', publishDate: '2026-02-01T00:00:00Z', draft: true },
    { url: '/blog/second/', title: 'Second', publishDate: '2026-01-01T00:00:00Z' },
    { url: '/blog/older/', title: 'Older', publishDate: '2025-01-01T00:00:00Z' }
  ]
  const output = renderBlogIndexList(posts, { yearSeparators: true })
  assert.deepEqual([...output.matchAll(/class="blog-entry h-entry"\s+data-year="(\d+)"/g)].map(match => match[1]), ['2026', '2025'])
  assert.doesNotMatch(output, /"data-year|data-year="(?:null|undefined)?"/)
  assert.match(output, /href="\/blog\/\?q=&quot;x&quot;&amp;a=1"/)
  assert.match(output, /&lt;script&gt;title&lt;\/script&gt;/)
  assert.equal((output.match(/class="blog-entry-draft draft-badge"/g) ?? []).length, 1)
  assert.doesNotMatch(renderBlogIndexList(posts), /data-year/)
})

test('generated blog indexes preserve rendered lists and archive links through nested layouts', async () => {
  const posts = [{ url: '/blog/example/', title: 'Example', publishDate: '2026-01-01T00:00:00Z' }]
  const generated = blogPages({ data: { blogPosts: posts, blogIndexes: [{ year: 2026, posts }] } })
  assert.equal(generated.length, 2)
  for (const page of generated) {
    const context = args(page.vars, page.children, page.outputName.replace(/\/index\.html$/, ''))
    const output = render(await rootLayout({ ...context, children: blogIndexLayout(context) }))
    assert.match(output, /<ul class="blog-index-list">/)
    assert.match(output, /<footer class="blog-index-footer">/)
    assert.match(output, /<a href="\/blog\/2026\/">2026<\/a>/)
    assert.doesNotMatch(output, /&lt;ul|&lt;footer|\[object Object\]/)
  }
})

test('redirects retain head metadata and a styled manual link', async () => {
  const context = args({ ...redirectDefaults, title: 'Redirecting…', redirectTo: '/resume/?a=1&b=2' }, '', 'cv')
  const output = render(await rootLayout({ ...context, children: redirectLayout(context) }))
  assert.match(output, /<meta name="robots" content="noindex">/)
  assert.match(output, /<meta http-equiv="refresh" content="0;url=\/resume\/\?a=1&amp;b=2">/)
  assert.match(output, /<link rel="canonical" href="\/resume\/\?a=1&amp;b=2">/)
  assert.match(output, /<main class="markdown-body mine-layout"/)
  assert.match(output, /<a href="\/resume\/\?a=1&amp;b=2">\/resume\/\?a=1&amp;b=2<\/a>/)
  assert.equal((output.match(/<html\b/g) ?? []).length, 1)
})
