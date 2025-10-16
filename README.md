# musanzi.me

A personal portfolio website built with Angular and Tailwind CSS. This repository contains the source for `musanzi.me` — a small, fast, and modern static site showcasing projects, experience, and services.

## Table of contents

- About
- Tech stack
- Project structure
- Scripts
- License

## About

This is an Angular application that serves as a personal site/portfolio. It uses the Angular CLI build system with Tailwind CSS for styling and ships static assets from the `public/` folder.

## Tech stack

- Angular (v20+)
- TypeScript
- Tailwind CSS
- lucide-angular (icons)

## Project structure (important files)

- `src/` — application source
  - `main.ts` — app entry
  - `index.html` — page shell
  - `styles.css` — global styles (Tailwind entry)
  - `app/` — app components, routes and features
- `public/` — static assets (images, icons, etc.) copied into build output
- `angular.json` — Angular build/serve/test config
- `package.json` — scripts and dependencies

## Scripts / common commands

The project uses the Angular CLI. Run these from the repository root.

- Install dependencies

  pnpm install

- Start dev server (hot reload)

  pnpm start

- Build for production

  pnpm run build

- Build in watch/dev mode

  pnpm run watch

If you prefer `npm` or `yarn`, replace `pnpm` with your package manager of choice. The project was developed with `pnpm` in the repo.

## License

This repository does not include a license file. Add a `LICENSE` file if you wish to make the code reusable under an open-source license.

## Contact

If you need help or want to collaborate, open an issue or contact the repository owner.
