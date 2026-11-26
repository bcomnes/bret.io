import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page, baseURL }) => {
  // Avoid sending analytics or relying on external scripts during a local test.
  await page.route('**/*', route => new URL(route.request().url()).origin === baseURL
    ? route.continue()
    : route.abort())
})

test('the referral homepage loads without changing its canonical URL', async ({ page }) => {
  const referral = '/?ref=blog.thenotification.app'
  expect((await page.goto(referral))?.status()).toBe(200)
  await expect(page).toHaveURL(referral)
  await expect(page.getByRole('heading', { level: 1, name: 'Bret Comnes' })).toBeVisible()
  await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute('href', 'https://bret.io/')
})

test('the old projects URL redirects to the canonical article', async ({ page }) => {
  const destination = '/blog/2023/previous-projects/'
  await page.goto('/projects/previous-projects/')
  await expect(page).toHaveURL(destination)
  await expect(page.getByRole('heading', { level: 1, name: 'Previously Featured Projects' })).toBeVisible()
  await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute('href', `https://bret.io${destination}`)
})
