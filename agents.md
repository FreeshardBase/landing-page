# Freeshard Landing Page

The marketing site for freeshard.net. Static Astro build, deployed to GitHub Pages (currently https://freeshardbase.github.io/landing-page/).

## Tech Stack

- **Framework**: Astro 5 (static output), TypeScript
- **Content**: `.astro` pages plus raw HTML fragments under `src/content/` for legal texts
- **i18n**: EN + DE, routed via `src/pages/[lang]/`

## Commands

```sh
npm install
npm run dev      # dev server
npm run build    # astro check && astro build
npm run preview  # preview the production build
```

## Structure

```
src/pages/        Routes (index, faq, impressum, datenschutz, [lang]/)
src/components/   Reusable page sections
src/layouts/      Page shells
src/content/      Legal text fragments (datenschutz-de.html, datenschutz-en.html)
src/i18n/         Translation catalogues
src/lib/          Helpers
src/icons/        Inline icon components
public/           Static assets (logos, favicons)
```

## Deployment

`.github/workflows/deploy-prod.yml` builds and publishes to GitHub Pages on every push to `main`.

## Commits

[Scoped Commits](https://scopedcommits.com/): `<scope>: <description>`. The scope is the area of the tree the change touches, never a change type — write `pages: add an FAQ entry on data export`, not `fix(pages): ...`. Body and trailers are optional; a change's reasoning belongs in the body, not in a code comment.

Scopes for this repo: `pages` `components` `layouts` `content` `i18n` `lib` `icons` `ci` `deps` `meta`

`meta` covers repo-level files (agents.md, README, justfile). For a change spanning several scopes, use a broader one, list two comma-separated, or use `treewide`. Merges and reverts keep their own format. Don't generate a changelog from the commit log — release notes come from merged PRs.
