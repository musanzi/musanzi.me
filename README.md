# musanzi.me

The source code for [musanzi.me](https://musanzi.me), Wilfried Musanzi's personal site. The site is written in French. It introduces my work as a fullstack web developer and publishes articles, and later courses and talks, all open source.

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
├── components/          Home and article UI components
├── content/articles/    Markdown articles
├── layouts/             Shared page layout and metadata
├── pages/               File-based routes
└── styles/global.css    Global styles and Tailwind setup
astro.config.mjs         Astro, sitemap, and Tailwind configuration
```

Article pages are generated from Markdown files in `src/content/articles/`. Add a Markdown file there to publish another article at `/articles/<slug>`.

## Production build

```sh
pnpm build
pnpm preview
```

The deployed site URL is configured as `https://musanzi.me` in `astro.config.mjs`, which Astro uses for canonical URLs and sitemap generation.

## License

The site's code is licensed under the [MIT License](LICENSE). The written content (articles, courses, and talk material) is licensed under [CC BY 4.0](LICENSE-CONTENT.md).
