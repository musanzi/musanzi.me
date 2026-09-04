import type { CollectionEntry } from 'astro:content'

export type Project = CollectionEntry<'projects'>

export function sortProjects(projects: Project[]) {
  return projects.toSorted((a, b) => a.data.order - b.data.order)
}
