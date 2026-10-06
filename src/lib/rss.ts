import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { de } from '../i18n/de';
import { en } from '../i18n/en';
import { getPosts, urlOf } from './blog';

export async function buildRss(lang: string, context: APIContext) {
  const t = (lang === 'en' ? en : de).blog;
  const posts = await getPosts(lang);

  return rss({
    title: t.title,
    description: t.intro,
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: urlOf(post),
    })),
    customData: `<language>${lang === 'en' ? 'en-gb' : 'de-de'}</language>`,
  });
}
