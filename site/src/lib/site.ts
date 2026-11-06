import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { marked } from 'marked';
import { normalizeBase } from './base';
import { buildSite } from './build';
import type { Site, Topic } from './types';

/**
 * Where the `/teach` workspaces live: `KYU_RIOS_TOPICS_DIR`, or the nearest `topics/` directory above the
 * working directory (the repo root when building from `site/`). Overridable so tests can use a fixture tree.
 */
export const topicsDir = process.env.KYU_RIOS_TOPICS_DIR ?? findTopicsDir(process.cwd());

function findTopicsDir(from: string): string {
  let dir = resolve(from);
  for (;;) {
    const candidate = join(dir, 'topics');
    if (existsSync(candidate)) return candidate;
    const parent = dirname(dir);
    if (parent === dir) throw new Error(`No topics/ directory found above ${from}; set KYU_RIOS_TOPICS_DIR`);
    dir = parent;
  }
}

let cached: Site | undefined;

/** The Site, built once per process. Astro calls this from every page and endpoint. */
export function getSite(): Site {
  return (cached ??= buildSite(topicsDir));
}

export function getTopic(slug: string): Topic {
  const topic = getSite().topics.find((t) => t.slug === slug);
  if (!topic) throw new Error(`No Published Topic "${slug}"`);
  return topic;
}

/** MISSION.md as HTML, with the leading "# Mission: …" heading dropped since the page already has a title. */
export function missionHtml(topic: Topic): string {
  const body = topic.mission.replace(/^#\s[^\n]*\n/, '');
  return marked.parse(body, { async: false }) as string;
}

/** The site's base path with a trailing slash, e.g. `/kyu-rios/`. */
export const base: string = normalizeBase(import.meta.env.BASE_URL);
