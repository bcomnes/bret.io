import type { LayoutChain, LayoutRegistryName } from '@domstack/static/types.js'
import type globalVars from '../globals/global.vars.js'
import type rootLayout from './root.layout.js'
import type articleLayout from './article.layout.js'
import type blogIndexLayout from './blog-index.layout.js'
import type bookReviewLayout from './book-review.layout.js'
import type redirectLayout from './redirect.layout.js'
import type { parentLayout as articleParent } from './article.layout.js'
import type { parentLayout as blogIndexParent } from './blog-index.layout.js'
import type { parentLayout as bookReviewParent } from './book-review.layout.js'
import type { parentLayout as redirectParent } from './redirect.layout.js'
import type { vars as bookReviewVars } from './book-review.layout.js'
import type { vars as redirectVars } from './redirect.layout.js'

declare module '@domstack/static/types.js' {
  interface LayoutRegistry {
    root: {
      render: typeof rootLayout
    }
    article: {
      parentLayout: typeof articleParent
      render: typeof articleLayout
    }
    'blog-index': {
      parentLayout: typeof blogIndexParent
      render: typeof blogIndexLayout
    }
    'book-review': {
      parentLayout: typeof bookReviewParent
      vars: typeof bookReviewVars
      render: typeof bookReviewLayout
    }
    redirect: {
      parentLayout: typeof redirectParent
      vars: typeof redirectVars
      render: typeof redirectLayout
    }
  }
}

export type SiteGlobalVars = Awaited<ReturnType<typeof globalVars>>

export type SiteLayoutName = LayoutRegistryName
export type SiteLayoutChains = {
  [Name in SiteLayoutName]: LayoutChain<Name>
}
