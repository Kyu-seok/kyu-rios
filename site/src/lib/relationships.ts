import { posix } from 'node:path';
import { hrefs } from './html';
import { AUTHORED_RELATIONSHIP_TYPES, BuildError, docFolder, nodeId, type Document, type GraphNode, type Relationship, type RelationshipType, type Topic } from './types';

/** Authored Relationships from every Topic's manifest, validated against the Published Nodes, then derived `mentions`. */
export function collectRelationships(topics: Topic[], nodes: GraphNode[]): Relationship[] {
  const ids = new Set(nodes.map((n) => n.id));
  const authored = topics.flatMap((topic) => authoredRelationships(topic, ids));
  const seen = new Set(authored.map(key));
  const mentions: Relationship[] = [];
  for (const topic of topics) {
    const docs = [...topic.lessons, ...topic.references];
    // A Topic page links to each of its Lessons and Reference sheets, so the Topic mentions them.
    for (const doc of docs) {
      const rel: Relationship = { from: topic.slug, to: doc.id, type: 'mentions' };
      if (seen.has(key(rel))) continue;
      seen.add(key(rel));
      mentions.push(rel);
    }
    for (const doc of docs) {
      for (const to of linkedNodeIds(doc, ids)) {
        const rel: Relationship = { from: doc.id, to, type: 'mentions' };
        if (to === doc.id || seen.has(key(rel))) continue;
        seen.add(key(rel));
        mentions.push(rel);
      }
    }
  }
  return [...authored, ...mentions];
}

/** One pair may carry several types; only an identical Relationship is a duplicate. */
function key(r: Relationship): string {
  return `${r.from}\u0000${r.to}\u0000${r.type}`;
}

function authoredRelationships(topic: Topic, ids: Set<string>): Relationship[] {
  const manifestPath = posix.join(topic.dir, 'topic.yaml');
  return topic.manifest.relationships.map((r, i) => {
    const where = `${manifestPath}: relationships[${i}]`;
    if (!(AUTHORED_RELATIONSHIP_TYPES as string[]).includes(r.type)) {
      throw new BuildError(`${where}: unknown Relationship type "${r.type}" (expected one of ${AUTHORED_RELATIONSHIP_TYPES.join(', ')})`);
    }
    return { from: resolveNodeId(r.from, topic.slug, ids, where), to: resolveNodeId(r.to, topic.slug, ids, where), type: r.type as RelationshipType };
  });
}

/** A full Node id is used as is; a bare stem (or `reference/<stem>`) means "in this Topic". */
function resolveNodeId(ref: string, topicSlug: string, ids: Set<string>, where: string): string {
  if (ids.has(ref)) return ref;
  const local = `${topicSlug}/${ref}`;
  if (ids.has(local)) return local;
  throw new BuildError(`${where}: "${ref}" is not a Published Node`);
}

/** Node ids of the Lessons and Reference sheets a document links to, in document order, without duplicates. */
function linkedNodeIds(doc: Document, ids: Set<string>): string[] {
  const docDir = `topics/${doc.topic}/${docFolder(doc.kind)}`;
  const out: string[] = [];
  for (const href of hrefs(doc.html)) {
    if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('#') || href.startsWith('/')) continue;
    const target = posix.normalize(posix.join(docDir, href.split('#')[0]!.split('?')[0]!));
    const id = nodeIdForPath(target);
    if (id && ids.has(id) && !out.includes(id)) out.push(id);
  }
  return out;
}

function nodeIdForPath(sitePath: string): string | undefined {
  const m = /^topics\/([^/]+)\/(lessons|reference)\/([^/]+)\.html$/.exec(sitePath);
  if (!m) return undefined;
  const [, topic, folder, stem] = m;
  return nodeId(folder === 'lessons' ? 'lesson' : 'reference', topic!, stem!);
}
