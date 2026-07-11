interface Window {
  toggleTheme: () => void
}

declare module 'uhtml-isomorphic' {
  export class Hole extends String {}

  export interface Tag {
    (template: TemplateStringsArray | readonly string[], ...values: unknown[]): Hole
    for: (object: object, id?: string) => Tag
    node: Tag
  }

  export const html: Tag
  export const svg: Tag

  export function render(
    where: StringConstructor,
    what: Hole | (() => Hole)
  ): string

  export function render<T extends { write: (content: string) => unknown }>(
    where: T,
    what: Hole | (() => Hole)
  ): T
}

declare module 'jsonfeed-to-atom' {
  interface JsonFeed {
    version: string
    title: string
    feed_url: string
    [key: string]: unknown
  }

  interface Options {
    feedURLFn?: (feedUrl: string, feed: JsonFeed) => string
  }

  export default function jsonfeedToAtom(
    feed: JsonFeed,
    options?: Options
  ): string
}

declare module 'mine.css' {
  export function toggleTheme(): void
}
