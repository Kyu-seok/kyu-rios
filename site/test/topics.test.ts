import { join } from 'node:path';
import { buildSite } from '../src/lib/build';

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
});
