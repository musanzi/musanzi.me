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
    "/projects": "/#a-propos",
    "/projects/fikiri": "/#a-propos",
    "/projects/cinolu-onestop": "/#a-propos",
    "/projects/kbm-2026": "/#a-propos",
    "/projects/innovation-summer-camp-2026": "/#a-propos",
    "/blog": "/articles",
    "/blog/my-thoughts-on-ai": "/articles/mes-reflexions-sur-l-ia",
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
