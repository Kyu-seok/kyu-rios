import type { Card } from 'ts-fsrs';

/** A reader's Progress: FSRS card state per question id. Lives in this browser's localStorage only. */
export type Progress = Record<string, Card>;

/** Keeps the pre-rename spelling on purpose: changing the key would wipe every reader's saved Progress. */
export const STORAGE_KEY = 'kyu-rios.progress.v1';
const FORMAT = 'kyu-rious-progress';
/** Files exported before the rename from kyu-rios still import. */
const FORMATS = new Set([FORMAT, 'kyu-rios-progress']);
const VERSION = 1;

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? parseProgress(raw) : {};
  } catch {
    return {};
  }
}

/** Saves quietly: a blocked or full store must not break the Review. */
export function saveProgress(progress: Progress): void {
  try {
    localStorage.setItem(STORAGE_KEY, serializeProgress(progress));
  } catch {
    /* private mode, quota, or storage disabled: the session still works, it just will not persist */
  }
}

export function serializeProgress(progress: Progress): string {
  return JSON.stringify({ format: FORMAT, version: VERSION, exportedAt: new Date().toISOString(), cards: progress });
}

/** Accepts the export format above. Dates come back as Date objects. Throws on anything else. */
export function parseProgress(text: string): Progress {
  const parsed: unknown = JSON.parse(text);
  if (typeof parsed !== 'object' || parsed === null) throw new Error('not a Progress file');
  const rec = parsed as Record<string, unknown>;
  if (typeof rec.format !== 'string' || !FORMATS.has(rec.format) || typeof rec.cards !== 'object' || rec.cards === null) throw new Error('not a kyu-rious Progress file');
  const out: Progress = {};
  for (const [id, value] of Object.entries(rec.cards as Record<string, unknown>)) {
    if (typeof value !== 'object' || value === null) continue;
    const card = { ...(value as Record<string, unknown>) };
    if (typeof card.due !== 'string' && !(card.due instanceof Date)) continue;
    card.due = new Date(card.due as string);
    if (card.last_review) card.last_review = new Date(card.last_review as string);
    out[id] = card as unknown as Card;
  }
  return out;
}
