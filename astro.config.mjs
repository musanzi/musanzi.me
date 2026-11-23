// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://musanzi.me",
  devToolbar: {
    enabled: false,
  },
  redirects: {
    "/projects": "/#about",
    "/projects/fikiri": "/#about",
    "/projects/cinolu-onestop": "/#about",
    "/projects/kbm-2026": "/#about",
    "/projects/innovation-summer-camp-2026": "/#about",
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
