import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { BuildError, type Question } from './types';

/**
 * Reads a Lesson's `<stem>.quiz.js` (whose whole content is `window.QUIZ = [...]`) and returns its questions.
 * The file is data: it is evaluated in an empty sandbox with no DOM, no modules and no network,
 * so the Lesson's own scripts are never run.
 */
export function readQuizFile(path: string): Question[] {
  const text = readFileSync(path, 'utf8');
  return parseQuiz(text, path);
}

export function parseQuiz(text: string, path: string): Question[] {
  const fail = (msg: string): never => {
    throw new BuildError(`${path}: ${msg}`);
  };
  const sandbox: { window: { QUIZ?: unknown } } = { window: {} };
  try {
    vm.runInNewContext(text, sandbox, { timeout: 1000, filename: path });
  } catch (err) {
    fail(`could not evaluate quiz file (${(err as Error).message})`);
  }
  const raw = sandbox.window.QUIZ;
  if (!Array.isArray(raw)) return fail('must assign an array to window.QUIZ');
  const seen = new Set<string>();
  return raw.map((q, i) => {
    const where = `question ${i + 1}`;
    if (typeof q !== 'object' || q === null) return fail(`${where} must be an object`);
    const r = q as Record<string, unknown>;
    if (typeof r.id !== 'string' || r.id.trim() === '') return fail(`${where} is missing a permanent "id"`);
    if (seen.has(r.id)) return fail(`duplicate question id "${r.id}"`);
    seen.add(r.id);
    if (typeof r.stem !== 'string' || r.stem.trim() === '') return fail(`${where} (${r.id}): "stem" must be a non-empty string`);
    if (!Array.isArray(r.options) || r.options.length < 2 || !r.options.every((o) => typeof o === 'string')) {
      return fail(`${where} (${r.id}): "options" must be a list of at least two strings`);
    }
    if (!Number.isInteger(r.answer) || (r.answer as number) < 0 || (r.answer as number) >= r.options.length) {
      return fail(`${where} (${r.id}): "answer" must be an index into "options"`);
    }
    if (typeof r.why !== 'string') return fail(`${where} (${r.id}): "why" must be a string`);
    const question: Question = { id: r.id, stem: r.stem, options: r.options as string[], answer: r.answer as number, why: r.why };
    if (typeof r.section === 'string') question.section = r.section;
    return question;
  });
}
