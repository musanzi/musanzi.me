import type { CollectionEntry } from 'astro:content'

export type BlogPost = CollectionEntry<'blog'>

export function sortPosts(posts: BlogPost[]) {
  return posts.toSorted((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime())
}

export function formatPostDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

export function getReadingTime(body = '') {
  const plainText = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`\[\]()-]/g, ' ')
  const words = plainText.trim().split(/\s+/).filter(Boolean).length

  return `${Math.max(1, Math.ceil(words / 220))} min read`
}
