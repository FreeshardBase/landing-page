# landing-page
The freeshard landing page to be deployed at freeshard.net. Currently deployed at https://freeshardbase.github.io/landing-page/

## Commands
```sh
npm install
npm run dev
```

```sh
npm run build
npm run preview
```

## Blog

The blog lives at `/<lang>/blog/` and moved here from the MkDocs docs site in [documentation#4](https://github.com/FreeshardBase/documentation/issues/4). The old `docs.freeshard.net/blog/` URLs now redirect here.

### Adding a post

Create `src/content/blog/en/<slug>.md`. The schema is in `src/content.config.ts`:

```yaml
---
title: "The post title"
description: "One or two sentences. Used as the list excerpt and the meta description."
pubDate: 2026-08-01
cover: ./<slug>/cover.png     # optional; also becomes the Open Graph image
coverAlt: "What the cover shows"   # required if cover is set
lang: en
author: Max von Tettenborn
draft: false                  # optional; drafts build in dev, never in production
updatedDate: 2026-08-14       # optional
---
```

Put the post's images in `src/content/blog/en/<slug>/` and reference them as `./<slug>/image.png`. Astro optimises them; they must live under `src/`, not `public/`.

Do not repeat the title as an `# H1` in the body — the template renders it from the frontmatter.

### Translations

The German version is `src/content/blog/de/<slug>.md` with the **same slug**, `lang: de`, and `aiTranslated: true` when it was machine-translated, which renders a notice linking back to the English original. Reuse the English post's images across directories (`../en/<slug>/image.png`) rather than duplicating the files.

The same slug in both languages is what lets the existing `LanguageSwitcher`, which only swaps the first path segment, work on post pages.

A post with no counterpart simply does not appear in the other language's index. There is no fallback.

### What is generated

- `/<lang>/blog/` — index, 10 posts per page, then `/<lang>/blog/2/`
- `/<lang>/blog/<slug>/` — post page
- `/<lang>/blog/rss.xml` — one feed per language
- `sitemap-index.xml` — via `@astrojs/sitemap`

Posts published before the April 2025 rename still say "Portal" throughout. That is deliberate; `isPreRebrand()` in `src/lib/blog.ts` dates them and the post page renders a short note explaining the old name instead of the text being rewritten.
