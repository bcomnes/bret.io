// jsonfeed-to-atom 1.x does not ship declarations and only accepts JSON Feed v1.
declare module 'jsonfeed-to-atom' {
  export interface JsonFeedAuthor {
    name?: string
    url?: string
    avatar?: string
  }

  export interface JsonFeedAttachment {
    url: string
    mime_type: string
    title?: string
    size_in_bytes?: number
    duration_in_seconds?: number
  }

  export interface JsonFeedItem {
    id: string
    url?: string
    external_url?: string
    title?: string
    content_html?: string
    content_text?: string
    summary?: string
    image?: string
    banner_image?: string
    date_published?: string
    date_modified?: string
    author?: JsonFeedAuthor
    tags?: string[]
    attachments?: JsonFeedAttachment[]
  }

  export interface JsonFeed {
    version: 'https://jsonfeed.org/version/1'
    title: string
    feed_url: string
    home_page_url?: string
    description?: string
    user_comment?: string
    next_url?: string
    icon?: string
    favicon?: string
    author?: JsonFeedAuthor
    expired?: boolean
    items: JsonFeedItem[]
  }

  export interface Options {
    feedURLFn?: (feedURL: string, feed: JsonFeed) => string
  }

  export default function jsonfeedToAtom(feed: JsonFeed, options?: Options): string
}
