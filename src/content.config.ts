import { defineCollection, reference } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const articles = defineCollection({
  loader: glob({ base: './src/content/articles', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    author: z.string().default('Wilfried Musanzi'),
    tags: z.array(z.string()).default([]),
    cover: z.object({ title: z.string(), subtitle: z.string().optional() }).optional()
  })
})

const courses = defineCollection({
  loader: glob({ base: './src/content/courses', pattern: '*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    author: z.string().default('Wilfried Musanzi'),
    tags: z.array(z.string()).default([]),
    sourceUrl: z.string().url().optional(),
    cover: z.object({ title: z.string(), subtitle: z.string().optional() }).optional()
  })
})

const chapters = defineCollection({
  loader: glob({ base: './src/content/chapters', pattern: '*/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    course: reference('courses'),
    order: z.number().int().positive()
  })
})

export const collections = { articles, courses, chapters }
