import { describe, expect, it } from 'vitest';
import { parseProgress, serializeProgress, STORAGE_KEY } from '../src/client/progress';

const card = { due: new Date('2026-11-07T00:00:00Z'), stability: 1, difficulty: 5, reps: 1, lapses: 0, state: 1 };

describe('Progress files', () => {
  it('round-trips through export and import', () => {
    const back = parseProgress(serializeProgress({ 'kafka/1/q1': card as never }));
    expect(back['kafka/1/q1']!.due).toEqual(card.due);
  });

  it('still imports a file exported before the rename from kyu-rios', () => {
    const old = JSON.stringify({ format: 'kyu-rios-progress', version: 1, cards: { 'kafka/1/q1': card } });
    expect(Object.keys(parseProgress(old))).toEqual(['kafka/1/q1']);
  });

  it('rejects a file with another format tag', () => {
    expect(() => parseProgress(JSON.stringify({ format: 'something-else', cards: {} }))).toThrow(/Progress file/);
  });

  it('keeps the pre-rename localStorage key so saved Progress survives', () => {
    expect(STORAGE_KEY).toBe('kyu-rios.progress.v1');
  });
});
