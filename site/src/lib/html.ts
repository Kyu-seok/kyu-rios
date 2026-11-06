/** Small, dependency-free readers for the HTML documents `/teach` writes. The build never executes them. */

export function documentTitle(html: string): string {
  const title = firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i) ?? firstMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return title ? textOf(title) : '';
}

/** One-line summary: the meta description, else the `.lede` paragraph, else the first paragraph. */
export function documentSummary(html: string): string {
  const meta = firstMatch(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  if (meta) return textOf(meta);
  const lede = firstMatch(html, /<p[^>]*class=["'][^"']*\blede\b[^"']*["'][^>]*>([\s\S]*?)<\/p>/i);
  if (lede) return textOf(lede);
  const body = firstMatch(html, /<body[^>]*>([\s\S]*)<\/body>/i) ?? html;
  const p = firstMatch(body, /<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/i);
  return p ? truncate(textOf(p), 160) : '';
}

/** Every `href` value in the document, in order. */
export function hrefs(html: string): string[] {
  const out: string[] = [];
  const re = /<a\s[^>]*?href=["']([^"']*)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) out.push(m[1]!);
  return out;
}

export function textOf(fragment: string): string {
  return decodeEntities(fragment.replace(/<[^>]+>/g, ''))
    .replace(/\s+/g, ' ')
    .trim();
}

function firstMatch(html: string, re: RegExp): string | undefined {
  const m = re.exec(html);
  return m?.[1];
}

function truncate(s: string, max: number): string {
  return s.length <= max ? s : s.slice(0, max - 1).trimEnd() + '…';
}

function decodeEntities(s: string): string {
  const named: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', hellip: '…', mdash: '—', ndash: '–' };
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n: string) => named[n.toLowerCase()] ?? m);
}
