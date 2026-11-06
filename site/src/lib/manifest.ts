import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { BuildError, type TopicManifest } from './types';

/** Reads and validates a Topic's `topic.yaml`. Throws BuildError with the file path on any malformation. */
export function readManifest(path: string): TopicManifest {
  let raw: unknown;
  try {
    raw = parse(readFileSync(path, 'utf8'));
  } catch (err) {
    throw new BuildError(`${path}: not valid YAML (${(err as Error).message})`);
  }
  return validateManifest(raw, path);
}

export function validateManifest(raw: unknown, path: string): TopicManifest {
  const fail = (msg: string): never => {
    throw new BuildError(`${path}: ${msg}`);
  };
  if (!isRecord(raw)) return fail('must be a YAML mapping with title, summary and published');
  const title = raw.title;
  if (typeof title !== 'string' || title.trim() === '') fail('"title" must be a non-empty string');
  const summary = raw.summary ?? '';
  if (typeof summary !== 'string') fail('"summary" must be a string');
  const published = raw.published ?? false;
  if (typeof published !== 'boolean') fail('"published" must be true or false');
  const exclude = stringList(raw.exclude, 'exclude', fail);
  const relationships = relationshipList(raw.relationships, fail);
  let reviewExclude: string[] = [];
  const review = raw.review;
  if (review !== undefined) {
    if (!isRecord(review)) return fail('"review" must be a mapping with an "exclude" list');
    reviewExclude = stringList(review.exclude, 'review.exclude', fail);
  }
  const known = new Set(['title', 'summary', 'published', 'exclude', 'relationships', 'review']);
  for (const key of Object.keys(raw)) if (!known.has(key)) fail(`unknown key "${key}"`);
  return { title: title as string, summary: summary as string, published: published as boolean, exclude, relationships, review: { exclude: reviewExclude } };
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function stringList(v: unknown, name: string, fail: (m: string) => never): string[] {
  if (v === undefined || v === null) return [];
  if (!Array.isArray(v) || !v.every((s) => typeof s === 'string')) fail(`"${name}" must be a list of strings`);
  return v as string[];
}

function relationshipList(v: unknown, fail: (m: string) => never): TopicManifest['relationships'] {
  if (v === undefined || v === null) return [];
  if (!Array.isArray(v)) fail('"relationships" must be a list of { from, to, type }');
  return (v as unknown[]).map((r, i) => {
    if (!isRecord(r) || typeof r.from !== 'string' || typeof r.to !== 'string' || typeof r.type !== 'string') {
      fail(`relationships[${i}] must be { from, to, type } with string values`);
    }
    const rec = r as Record<string, string>;
    return { from: rec.from, to: rec.to, type: rec.type };
  });
}
