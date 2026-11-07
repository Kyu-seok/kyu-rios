// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages project site: https://kyu-seok.github.io/kyu-rious/
export default defineConfig({
  site: 'https://kyu-seok.github.io',
  base: '/kyu-rious',
  output: 'static',
  trailingSlash: 'ignore',
  compressHTML: true,
});
