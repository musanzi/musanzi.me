# Oies Sarl — Website (Angular)

This repository contains the source for the Oies Sarl public website, implemented with Angular 20.

The app is a small, component-based single page application (SPA) using Angular Router. It integrates AOS (Animate On Scroll) and Tailwind CSS utilities (Tailwind/PostCSS are present in devDependencies).

## Quick facts

- Framework: Angular 20
- Language: TypeScript
- Styles: Plain CSS (with Tailwind/PostCSS available in devDependencies)
- Animations: AOS (Animate On Scroll)

## Prerequisites

- Node.js (recommended v18+)
- pnpm (this repository uses pnpm workspace lockfile; npm or yarn may also work but pnpm is recommended)
- Angular CLI (optional, can use the local CLI via npx or pnpm)

Install pnpm if you don't have it:

```bash
npm install -g pnpm
```

## Setup

Clone the repo and install dependencies:

```bash
git clone <repo-url>
cd musanzi.me
pnpm install
```

Use the local Angular CLI via pnpm scripts. The important scripts provided in `package.json` are:

- `pnpm start` (or `pnpm ng serve`) — start the development server (default on http://localhost:4200)
- `pnpm build` — build the production bundle (output goes to `dist/`)
- `pnpm watch` — build in watch mode for development
- `pnpm test` — run unit tests (Karma)

Run the dev server:

```bash
pnpm start
```

Open http://localhost:4200 in your browser.

## Project structure (important files)

- `angular.json` — Angular CLI configuration (build/serve/test targets)
- `package.json` — scripts and dependencies
- `src/main.ts` — application entry
- `src/index.html` — main HTML shell
- `src/styles.css` — global styles
- `src/app/app.ts` — root component and AOS initialization
- `src/app/app.html` — root component template
- `src/app/landing/*` — landing page feature modules and components (hero, home, about, goals, activities)
- `src/app/shared/ui/*` — shared UI components (topbar, footer, loader)
- `public/` — static assets served/copied into build (images, icons, etc.)

## Notes about the codebase

- AOS is initialized in the root `App` component after the first render using Angular's `NgZone` and `afterNextRender` to run the initialization outside Angular's zone.
- The project is configured to allow `aos` as a CommonJS dependency in the build options.
- Tailwind/PostCSS packages are present in `devDependencies`. If you're adding Tailwind utility classes, ensure `tailwind.config.cjs` and postcss config (if required) are present or added.

## Building for production

Build the production bundle with:

```bash
pnpm build
```

The optimized output is placed in `dist/` by default.

## Testing

Run unit tests with Karma:

```bash
pnpm test
```

## Linting & Formatting

This repository doesn't include ESLint or Prettier config by default. If you want linters, install and configure them (recommended: ESLint with TypeScript support).

## Deployment

The output in `dist/` can be deployed to any static hosting provider (Netlify, Vercel, GitHub Pages, S3, etc.). For servers that require a fallback route for SPA, configure redirects to `index.html`.
