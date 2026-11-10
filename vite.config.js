import { defineConfig } from 'vite';

// GitHub Pages deploys to https://<user>.github.io/generator/
export default defineConfig({
  base: process.env.GITHUB_PAGES_BASE || '/generator/',
  build: { outDir: 'dist' },
  server: { open: true },
});
