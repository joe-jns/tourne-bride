// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: "https://joe-jns.github.io",
  base: "/tourne-bride/",
  vite: {
    plugins: [tailwindcss()],
  },
});
