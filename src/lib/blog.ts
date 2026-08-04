import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

// The generated type for a zod `image()` field is structurally looser than
// ImageMetadata, so <Image> rejects it without this narrowing.
export function coverOf(post: BlogPost): ImageMetadata | undefined {
  return post.data.cover as ImageMetadata | undefined;
}

export const POSTS_PER_PAGE = 10;

export function slugOf(post: BlogPost): string {
  return post.id.split('/').pop()!;
}

export function urlOf(post: BlogPost): string {
  return `/${post.data.lang}/blog/${slugOf(post)}/`;
}

export async function getPosts(lang: string): Promise<BlogPost[]> {
  const posts = await getCollection('blog', ({ data }) => {
    if (data.lang !== lang) return false;
    return import.meta.env.PROD ? !data.draft : true;
  });
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

const REBRAND_DATE = new Date('2025-04-29T00:00:00Z');

export function isPreRebrand(post: BlogPost): boolean {
  return post.data.pubDate < REBRAND_DATE;
}

export function formatDate(date: Date, lang: string): string {
  return date.toLocaleDateString(lang === 'en' ? 'en-GB' : 'de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
