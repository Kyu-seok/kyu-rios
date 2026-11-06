/** The site's base path with a trailing slash, e.g. `/kyu-rios/`. Safe to import from browser code. */
export function normalizeBase(b: string | undefined): string {
  const s = b && b !== '' ? b : '/';
  return s.endsWith('/') ? s : `${s}/`;
}

/** The base path of the running site, from Astro's `base` config. */
export const clientBase: string = normalizeBase(import.meta.env.BASE_URL);
