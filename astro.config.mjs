import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkEmoji from 'remark-emoji';

// https://astro.build/config
export default defineConfig({
  site: 'https://freeshard.net',
  trailingSlash: 'always',
  markdown: {
    remarkPlugins: [remarkEmoji],
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'de',
        locales: {
          de: 'de-DE',
          en: 'en-GB',
        },
      },
    }),
  ],
});
