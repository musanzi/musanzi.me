import { getCollection, type CollectionEntry } from 'astro:content';

export type Course = CollectionEntry<'courses'>;
export type Chapter = CollectionEntry<'chapters'>;

const wordsPerMinute = 220;

export function sortCourses(courses: Course[]) {
  return courses.toSorted((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}

export function sortChapters(chapters: Chapter[]) {
  return chapters.toSorted((a, b) => a.data.order - b.data.order);
}

export async function getCourseChapters(courseId: string) {
  const chapters = await getCollection('chapters', (chapter) => chapter.data.course.id === courseId);
  return sortChapters(chapters);
}

export function chapterSlug(chapter: Chapter) {
  return chapter.id.slice(chapter.id.indexOf('/') + 1);
}

export function courseUrl(courseId: string) {
  return `/cours/${courseId}`;
}

export function chapterUrl(chapter: Chapter) {
  return `/cours/${chapter.data.course.id}/${chapterSlug(chapter)}`;
}

export function formatChapterNumber(position: number) {
  return String(position).padStart(2, '0');
}

export function getReadingMinutes(body = '') {
  const plainText = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`\[\]()-]/g, ' ');
  const words = plainText.trim().split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function getTotalReadingMinutes(chapters: Chapter[]) {
  return chapters.reduce((total, chapter) => total + getReadingMinutes(chapter.body), 0);
}

export function formatChapterCount(count: number) {
  return `${count} chapitre${count > 1 ? 's' : ''}`;
}

export function formatMinutes(minutes: number) {
  return `${minutes} min`;
}
