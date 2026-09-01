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

test('builds generated blog indexes and variable-driven redirects', async (t) => {
  const build = await testBuild('./src')
  t.after(build.cleanup)

  const blogIndex = await build.readOutput('blog/index.html')
  assert.match(blogIndex, /Blog Posts/)
  assert.match(blogIndex, /href="\/blog\/2026\/"/)

  for (const year of [2019, 2020, 2021, 2023, 2024, 2025, 2026]) {
    const archive = await build.readOutput(`blog/${year}/index.html`)
    assert.match(archive, new RegExp(`${year} Blog Posts`))
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
  for (const [legacyOutput, , canonicalUrl] of movedPages) {
    const legacyUrl = `/${legacyOutput.replace(/index\.html$/, '')}`
    assert.doesNotMatch(sitemap, new RegExp(`<loc>https://bret\\.io${legacyUrl}</loc>`))
    assert.match(sitemap, new RegExp(`<loc>https://bret\\.io${canonicalUrl}</loc>`))
  }
  assert.doesNotMatch(sitemap, /<loc>https:\/\/bret\.io\/(?:projects|jobs|cv)\/<\/loc>/)
  assert.match(sitemap, /<loc>https:\/\/bret\.io\/resume\/<\/loc>/)
})
