import { readFileSync } from 'node:fs';
import type { APIRoute } from 'astro';
import { renderDocument } from '../../../lib/build';
import { base, getSite } from '../../../lib/site';

/**
 * Everything inside a Topic other than its index page: Lesson and Reference sheet pages (the original
 * HTML with the site header and local Graph injected), and `.quiz.js` and asset files copied verbatim.
 */
export function getStaticPaths() {
  const site = getSite();
  const documents = site.topics.flatMap((t) => [...t.lessons, ...t.references]);
  return site.outputs
    .filter((o) => o.kind === 'lesson' || o.kind === 'reference' || o.kind === 'quiz' || o.kind === 'asset')
    .map((o) => {
      const [, topic, ...rest] = o.path.split('/');
      const documentId = documents.find((d) => d.path === o.path)?.id;
      return { params: { topic, file: rest.join('/') }, props: { output: o, documentId } };
    });
}

export const GET: APIRoute = ({ props }) => {
  const site = getSite();
  const { output, documentId } = props as { output: (typeof site.outputs)[number]; documentId?: string };
  if (documentId) {
    return new Response(renderDocument(site, documentId, base), { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }
  return new Response(readFileSync(output.source!));
};
