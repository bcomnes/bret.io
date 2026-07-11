import test from 'node:test'
import assert from 'node:assert'
import { absoluteHtmlUrls } from './src/feeds.template.js'

test('testing is set up and works', (t) => {
  assert.ok(true, 'yup')
})

test('feed content uses absolute URLs', () => {
  const content = absoluteHtmlUrls(`
    <a href="../another-post/">Another post</a>
    <img src="./img/example.jpg" srcset="./img/example.jpg 1x, ./img/example@2x.jpg 2x">
  `, 'https://bret.io/blog/2026/example/')

  assert.match(content, /href="https:\/\/bret\.io\/blog\/2026\/another-post\/"/)
  assert.match(content, /src="https:\/\/bret\.io\/blog\/2026\/example\/img\/example\.jpg"/)
  assert.match(content, /srcset="https:\/\/bret\.io\/blog\/2026\/example\/img\/example\.jpg 1x, https:\/\/bret\.io\/blog\/2026\/example\/img\/example@2x\.jpg 2x"/)
})
