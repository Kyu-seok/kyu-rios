import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import type { Question } from '../src/lib/types';

/** Writes a `topics/` tree into a fresh temp dir and returns its path. Keys are paths relative to the topics dir. */
export function topicsTree(files: Record<string, string>): string {
  const dir = mkdtempSync(join(tmpdir(), 'kyu-rious-topics-'));
  for (const [rel, content] of Object.entries(files)) {
    const abs = join(dir, rel);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, content);
  }
  return dir;
}

/** A minimal Lesson document, in the shape `/teach` produces. */
export function lessonHtml(opts: {
  title: string;
  lede?: string;
  body?: string;
  quizScript?: string;
}): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${opts.title}</title>
<link rel="stylesheet" href="../assets/style.css">
</head>
<body>
<main>
<h1>${opts.title}</h1>
${opts.lede ? `<p class="lede">${opts.lede}</p>` : ''}
${opts.body ?? ''}
<div id="quiz"></div>
</main>
<script src="../assets/quiz.js"></script>
${opts.quizScript ?? ''}
</body>
</html>
`;
}

export function quizJs(questions: Question[]): string {
  return `window.QUIZ = ${JSON.stringify(questions, null, 2)};\n`;
}

export function manifest(opts: {
  title: string;
  summary?: string;
  published?: boolean;
  exclude?: string[];
  relationships?: Array<{ from: string; to: string; type: string }>;
  reviewExclude?: string[];
}): string {
  const lines = [`title: ${JSON.stringify(opts.title)}`, `summary: ${JSON.stringify(opts.summary ?? 'A summary.')}`];
  if (opts.published !== undefined) lines.push(`published: ${opts.published}`);
  if (opts.exclude) lines.push('exclude:', ...opts.exclude.map((e) => `  - ${e}`));
  if (opts.relationships) {
    lines.push('relationships:');
    for (const r of opts.relationships) lines.push(`  - { from: ${JSON.stringify(r.from)}, to: ${JSON.stringify(r.to)}, type: ${r.type} }`);
  }
  if (opts.reviewExclude) lines.push('review:', '  exclude:', ...opts.reviewExclude.map((e) => `    - ${e}`));
  return lines.join('\n') + '\n';
}
