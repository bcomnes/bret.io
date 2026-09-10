import test from 'node:test'
import assert from 'node:assert/strict'
import feedsTemplate, { absoluteHtmlUrls } from './src/feeds.template.js'

const baseUrl = 'https://bret.io/blog/2026/example/'

test('feed HTML resolves article-relative links, media, and responsive images', () => {
  const output = absoluteHtmlUrls(`
    <a href="../another-post/">Another post</a>
    <a href="#details">Details</a>
    <img src='./img/example.jpg' srcset="./img/example.jpg 1x, ./img/example@2x.jpg 2x">
    <video poster="/poster.jpg"><source src="//media.example.com/movie.mp4"></video>
    <source srcset="./small.webp 480w, ./large.webp 960w">
  `, baseUrl)

  assert.ok(output.includes('href="https://bret.io/blog/2026/another-post/"'))
  assert.ok(output.includes(`href="${baseUrl}#details"`))
  assert.ok(output.includes(`src="${baseUrl}img/example.jpg"`))
  assert.ok(output.includes(`srcset="${baseUrl}img/example.jpg 1x, ${baseUrl}img/example@2x.jpg 2x"`))
  assert.ok(output.includes('poster="https://bret.io/poster.jpg"'))
  assert.ok(output.includes('src="https://media.example.com/movie.mp4"'))
  assert.ok(output.includes(`srcset="${baseUrl}small.webp 480w, ${baseUrl}large.webp 960w"`))
})

test('feed HTML preserves absolute and non-HTTP URLs', () => {
  const content = `<a href="https://example.com/?q=a&amp;b=c">External</a>
    <a href="mailto:bret@example.com">Email</a>
    <a href="javascript:void(0)">Script</a>
    <img src="data:image/png;base64,AAAA" srcset="data:image/png;base64,AAAA 1x">
  `
  assert.equal(absoluteHtmlUrls(content, baseUrl), content)
})

test('feed HTML decodes URL entities and escapes the resulting attributes', () => {
  const content = '<a href="&#47;about/?q=&quot;hello&quot;&amp;other=1">About</a>'
  assert.equal(absoluteHtmlUrls(content, baseUrl), '<a href="https://bret.io/about/?q=%22hello%22&amp;other=1">About</a>')
  const external = '<a href="https://example.com&#47;article">External</a>'
  assert.equal(absoluteHtmlUrls(external, baseUrl), external)
})

test('feed srcset preserves commas within URLs, data candidates, and descriptors', () => {
  const content = '<img srcset="./image,a.png 1x, ./large.png 2x">'
  assert.equal(absoluteHtmlUrls(content, baseUrl), `<img srcset="${baseUrl}image,a.png 1x, ${baseUrl}large.png 2x">`)
  const mixed = '<img srcset="data:image/png;base64,AAAA 1x, ./large.png 2x">'
  assert.equal(absoluteHtmlUrls(mixed, baseUrl), `<img srcset="data:image/png;base64,AAAA 1x, ${baseUrl}large.png 2x">`)
  const noDescriptors = '<img srcset="./small.png,\n ./large.png">'
  assert.equal(absoluteHtmlUrls(noDescriptors, baseUrl), `<img srcset="${baseUrl}small.png,\n ${baseUrl}large.png">`)
})

test('feed HTML only rewrites actual attributes, preserving examples and other markup', () => {
  const untouched = `<pre>&lt;img src="./example.png"&gt;</pre>
    <!-- <img src="./comment.png"> -->
    <script>const example = '<img src="./script.png">'</script>
    <textarea><img src="./text.png"></textarea>`
  assert.equal(absoluteHtmlUrls(untouched, baseUrl), untouched)
  assert.equal(absoluteHtmlUrls('<IMG SRC = ./image.png>', baseUrl), `<IMG src="${baseUrl}image.png">`)
  assert.equal(absoluteHtmlUrls('<template><img src="./image.png"></template>', baseUrl), `<template><img src="${baseUrl}image.png"></template>`)
})

test('JSON and Atom feeds receive absolute article content without changing the source', async () => {
  const post = {
    path: 'blog/2026/example',
    url: '/blog/2026/example/',
    publishDate: '2026-01-01T00:00:00.000Z',
    title: 'Example',
    draft: false,
    contentHtml: '<p><img src="./img/example.jpg"></p>'
  }
  for (const siteUrl of ['https://bret.io', 'https://bret.io/']) {
    const outputs = []
    for await (const output of feedsTemplate({
      vars: {
        siteUrl,
        siteName: 'Bret',
        description: 'Personal website',
        authorName: 'Bret',
        authorUrl: 'https://bret.io',
        authorImgUrl: 'https://bret.io/avatar.png'
      },
      data: { feedPosts: [post] }
    })) outputs.push(output)

    assert.deepEqual(outputs.map(output => output.outputName), ['feed.json', 'feed.xml', 'atom.xml'])
    const feed = JSON.parse(outputs[0].content)
    assert.equal(feed.feed_url, 'https://bret.io/feed.json')
    assert.equal(feed.items[0].url, baseUrl)
    assert.equal(feed.items[0].id, `${baseUrl}#${post.publishDate}`)
    assert.equal(feed.items[0].content_html, `<p><img src="${baseUrl}img/example.jpg"></p>`)
    assert.ok(outputs[1].content.includes(`${baseUrl}img/example.jpg`))
    assert.equal(outputs[1].content, outputs[2].content)
    assert.equal(post.contentHtml, '<p><img src="./img/example.jpg"></p>')
  }
})
