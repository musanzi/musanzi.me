import type { CollectionEntry } from 'astro:content'

export type Article = CollectionEntry<'articles'>

export function sortArticles(articles: Article[]) {
  return articles.toSorted((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime())
}

export function formatArticleDate(date: Date) {
  return new Intl.DateTimeFormat('fr-FR', {
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

  return `${Math.max(1, Math.ceil(words / 220))} min de lecture`
}
