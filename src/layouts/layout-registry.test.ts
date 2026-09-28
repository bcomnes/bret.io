import type { ValidatePageVars } from '@domstack/static/types.js'
import type { SiteGlobalVars, SiteLayoutChains, SiteLayoutName } from './layout-registry.ts'
import type { BlogPageVars } from '../blog.pages.js'
import type { RedirectPageVars } from '../redirects.pages.js'
import type { BookReviewLayoutVars } from './book-review.layout.js'

type BookReviewPageVars = BookReviewLayoutVars & { title: string }

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false
type Assert<T extends true> = T

// These assertions run through tsc, including checks that incomplete vars are rejected.
export type RegistryAssertions = [
  Assert<Equal<SiteLayoutName, 'root' | 'article' | 'blog-index' | 'book-review' | 'redirect'>>,
  Assert<Equal<SiteLayoutChains['blog-index'], readonly ['root', 'blog-index']>>,
  Assert<Equal<SiteLayoutChains['book-review'], readonly ['root', 'article', 'book-review']>>,
  Assert<Equal<SiteLayoutChains['redirect'], readonly ['root', 'redirect']>>,
  Assert<Equal<ValidatePageVars<'blog-index', BlogPageVars, SiteGlobalVars>, BlogPageVars>>,
  Assert<Equal<ValidatePageVars<'redirect', RedirectPageVars, SiteGlobalVars>, RedirectPageVars>>,
  Assert<Equal<ValidatePageVars<'blog-index', Omit<BlogPageVars, 'title'>, SiteGlobalVars>, never>>,
  Assert<Equal<ValidatePageVars<'redirect', Omit<RedirectPageVars, 'redirectTo'>, SiteGlobalVars>, never>>,
  Assert<Equal<ValidatePageVars<'blog-index', BlogPageVars>, never>>,
    Assert<Equal<keyof BookReviewLayoutVars, 'book' | 'review'>>,
    Assert<Equal<ValidatePageVars<'book-review', BookReviewPageVars, SiteGlobalVars>, BookReviewPageVars>>,
    Assert<Equal<ValidatePageVars<'book-review', BookReviewLayoutVars, SiteGlobalVars>, never>>,
    Assert<Equal<ValidatePageVars<'book-review', Omit<BookReviewPageVars, 'book'>, SiteGlobalVars>, never>>,
    Assert<Equal<ValidatePageVars<'book-review', Omit<BookReviewPageVars, 'review'>, SiteGlobalVars>, never>>,
    Assert<Equal<ValidatePageVars<'book-review', BookReviewPageVars, Omit<SiteGlobalVars, 'siteUrl'>>, never>>
]
