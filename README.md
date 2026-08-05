# musanzi.me

The source code for [musanzi.me](https://musanzi.me), Wilfried Musanzi's personal portfolio. The site introduces my work as a full-stack web developer and presents selected projects as individual case studies.

## Getting started

### Prerequisites

- Node.js 22.12 or newer
- pnpm

### Installation

```sh
pnpm install
```

### Local development

```sh
pnpm dev
```

Astro will print the local development URL in the terminal, typically `http://localhost:4321`.

## Available commands

| Command                   | Description                          |
| ------------------------- | ------------------------------------ |
| `pnpm dev`                | Start the local development server   |
| `pnpm build`              | Create a production build in `dist/` |
| `pnpm preview`            | Preview the production build locally |
| `pnpm astro -- <command>` | Run an Astro CLI command             |

## Project structure

```text
public/                  Static files copied as-is
src/
├── assets/              Images processed by Astro
├── components/          Home and project UI components
├── data/projects.ts     Project case-study content
├── layouts/             Shared page layout and metadata
├── pages/               File-based routes
└── styles/global.css    Global styles and Tailwind setup
astro.config.mjs         Astro, sitemap, and Tailwind configuration
```

Project pages are generated from the entries in `src/data/projects.ts`. Add an entry there, together with its image in `src/assets/`, to publish another case study at `/projects/<slug>`.

## Production build

```sh
pnpm build
pnpm preview
```

The deployed site URL is configured as `https://musanzi.me` in `astro.config.mjs`, which Astro uses for canonical URLs and sitemap generation.
