// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages project site: https://kyu-seok.github.io/kyu-rios/
export default defineConfig({
  site: 'https://kyu-seok.github.io',
  base: '/kyu-rios',
  output: 'static',
  trailingSlash: 'ignore',
  compressHTML: true,
});
