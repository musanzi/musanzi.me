import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    author: z.string().default('Wilfried Musanzi'),
    tags: z.array(z.string()).default([]),
  }),
})

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      description: z.string(),
      image: image(),
      imageAlt: z.string(),
      role: z.string(),
      organization: z.string(),
      period: z.string().optional(),
      order: z.number(),
      featured: z.boolean().default(false),
      tags: z.array(z.string()).default([]),
      outcomes: z.array(z.string()).default([]),
      links: z
        .array(
          z.object({
            label: z.string(),
            url: z.string().url(),
            type: z.enum(['live', 'github']),
          }),
        )
        .default([]),
    }),
})

export const collections = { blog, projects }
