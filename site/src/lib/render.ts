import { escapeAttr, escapeHtml } from './escape';
import type { Document, Site, Topic } from './types';

/**
 * A Lesson or Reference sheet page: the original HTML served verbatim, with a thin site header injected
 * right after `<body>` and the local Graph injected before `</body>`. Nothing else is touched, so the
 * document's own styling and interactive components keep working.
 */
export function renderDocument(site: Site, nodeId: string, base: string): string {
  const found = findDocument(site, nodeId);
  if (!found) throw new Error(`No Published Lesson or Reference sheet with id "${nodeId}"`);
  const { topic, doc } = found;
  const header = siteHeader(topic, doc, base);
  const graph = localGraph(doc, base);
  const html = doc.html;
  const bodyOpen = /<body[^>]*>/i.exec(html);
  const bodyClose = html.lastIndexOf('</body>');
  if (!bodyOpen || bodyClose < 0) throw new Error(`${doc.sourcePath}: expected a <body> … </body> to inject the site header into`);
  const headerAt = bodyOpen.index + bodyOpen[0].length;
  return html.slice(0, headerAt) + header + html.slice(headerAt, bodyClose) + graph + html.slice(bodyClose);
}

export function findDocument(site: Site, nodeId: string): { topic: Topic; doc: Document } | undefined {
  for (const topic of site.topics) {
    const doc = [...topic.lessons, ...topic.references].find((d) => d.id === nodeId);
    if (doc) return { topic, doc };
  }
  return undefined;
}

function siteHeader(topic: Topic, doc: Document, base: string): string {
  const url = (path: string) => base + path;
  const index = doc.kind === 'lesson' ? topic.lessons.findIndex((l) => l.id === doc.id) : -1;
  const prev = index > 0 ? topic.lessons[index - 1] : undefined;
  const next = index >= 0 && index < topic.lessons.length - 1 ? topic.lessons[index + 1] : undefined;
  const link = (d: Document | undefined, rel: 'prev' | 'next', label: string) =>
    d ? `<a rel="${rel}" href="${url(d.path)}" title="${escapeAttr(d.title)}">${label}</a>` : `<span class="rios-nav-gap"></span>`;
  return `
<nav class="rios-nav" aria-label="Site">
<style>
.rios-nav{all:initial;display:flex;align-items:center;gap:1rem;box-sizing:border-box;width:100%;padding:.5rem 1rem;font:14px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2937;background:#f8fafc;border-bottom:1px solid #e2e8f0}
.rios-nav a{color:#0f766e;text-decoration:none;white-space:nowrap}
.rios-nav a:hover{text-decoration:underline}
.rios-nav .rios-nav-home{font-weight:600;color:#1f2937}
.rios-nav .rios-nav-topic{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis}
.rios-nav .rios-nav-gap{display:inline-block;min-width:4rem}
</style>
<a class="rios-nav-home" href="${url('')}">kyu-rious</a>
<a class="rios-nav-topic" href="${url(`topics/${topic.slug}/`)}">↑ ${escapeHtml(topic.title)}</a>
${link(prev, 'prev', '← Previous')}
${link(next, 'next', 'Next →')}
</nav>
`;
}

function localGraph(doc: Document, base: string): string {
  const src = `${base}embed/graph/?focus=${encodeURIComponent(doc.id)}`;
  return `
<section class="rios-local-graph" aria-label="Related ideas">
<style>
.rios-local-graph{all:initial;display:block;box-sizing:border-box;width:100%;margin:2rem 0 0;padding:1rem;font:14px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2937;background:#f8fafc;border-top:1px solid #e2e8f0}
.rios-local-graph h2{all:initial;display:block;font:600 14px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2937;margin:0 0 .5rem}
.rios-local-graph iframe{display:block;width:100%;height:320px;border:1px solid #e2e8f0;border-radius:8px;background:#fff}
</style>
<h2>Related ideas</h2>
<iframe src="${src}" title="Local Graph of related ideas" loading="lazy"></iframe>
</section>
`;
}
