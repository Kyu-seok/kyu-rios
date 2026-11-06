import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildSite } from '../src/lib/build';
import { findPrivateStrings } from '../src/lib/private';

const topicsDir = join(import.meta.dirname, '..', '..', 'topics');

describe("this repo's own Topics", () => {
  it('build without error and every Published Lesson has a Quiz', () => {
    const site = buildSite(topicsDir);
    expect(site.topics.length).toBeGreaterThan(0);
    for (const topic of site.topics) {
      for (const lesson of topic.lessons) {
        expect(lesson.questions.length, `${lesson.id} has no questions`).toBeGreaterThan(0);
        expect(lesson.title, `${lesson.id} has no title`).not.toBe('');
      }
    }
    expect(site.review.cards.length).toBeGreaterThan(0);
    expect(site.graph.relationships.some((r) => r.type === 'mentions')).toBe(true);
  });

  it('publish nothing that points at the author: no home paths, nothing from topics/.private-strings', () => {
    // Patterns safe to publish live here. Names and handles stay out of the public repo: one per line in the
    // gitignored topics/.private-strings, which makes the laptop run stricter than CI.
    const patterns = ['/Users/', '~/Work/learn'];
    const local = join(topicsDir, '.private-strings');
    if (existsSync(local)) {
      patterns.push(...readFileSync(local, 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#')));
    }
    expect(findPrivateStrings(buildSite(topicsDir), patterns)).toEqual([]);
  });
});
