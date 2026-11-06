#!/usr/bin/env node
// One-time migration: move each Lesson's inline Quiz into `lessons/<stem>.quiz.js` (window.QUIZ = [...])
// and give every question a permanent id `<topic-slug>/<lesson-number>/q<n>`.
//
// Handles the two shapes `/teach` has produced so far:
//   A. Inline `Quiz.mount(target, [...])` / `Quiz.register("id", [...])` calls in a <script> block.
//   B. Markup quizzes: `<div class="quiz"><div class="q" data-answer="n">…</div></div>` (ai-engineering-101).
//
// Usage: node scripts/migrate-quizzes.mjs [--dry-run] [topicsDir]
// Lessons that already have a `.quiz.js` are left alone, so the script is safe to re-run.

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import vm from 'node:vm';
import * as acorn from 'acorn';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const topicsDir = resolve(args.find((a) => !a.startsWith('--')) ?? join(import.meta.dirname, '..', '..', 'topics'));

let changed = 0;
for (const slug of readdirSync(topicsDir).sort()) {
  const lessonsDir = join(topicsDir, slug, 'lessons');
  if (!existsSync(lessonsDir)) continue;
  for (const file of readdirSync(lessonsDir).filter((f) => f.endsWith('.html')).sort()) {
    const stem = file.slice(0, -5);
    const quizPath = join(lessonsDir, `${stem}.quiz.js`);
    if (existsSync(quizPath)) continue;
    const htmlPath = join(lessonsDir, file);
    const html = readFileSync(htmlPath, 'utf8');
    const lessonNumber = String(Number.parseInt(stem, 10));
    const result = migrateInlineCalls(html, stem) ?? migrateMarkup(html, stem);
    if (!result) {
      console.log(`skip   ${slug}/lessons/${file}: no Quiz found`);
      continue;
    }
    const questions = result.questions.map((q, i) => ({ id: `${slug}/${lessonNumber}/q${i + 1}`, ...q }));
    const quizSource = `window.QUIZ = ${serialize(questions)};\n`;
    console.log(`${dryRun ? 'would ' : ''}write  ${slug}/lessons/${stem}.quiz.js (${questions.length} questions, sections: ${[...new Set(questions.map((q) => q.section ?? '(none)'))].join(', ')})`);
    if (!dryRun) {
      writeFileSync(quizPath, quizSource);
      writeFileSync(htmlPath, result.html);
    }
    changed++;
  }
}
console.log(`${dryRun ? 'would migrate' : 'migrated'} ${changed} Lesson(s)`);

/** Shape A. Returns null when the Lesson has no Quiz.mount / Quiz.register call. */
function migrateInlineCalls(html, stem) {
  const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)];
  const calls = [];
  for (const m of scripts) {
    const code = m[1];
    const codeStart = m.index + m[0].indexOf(code);
    let ast;
    try {
      ast = acorn.parse(code, { ecmaVersion: 'latest', sourceType: 'script' });
    } catch (err) {
      throw new Error(`${stem}: could not parse inline script: ${err.message}`);
    }
    walk(ast, (node) => {
      if (node.type !== 'CallExpression' || node.callee.type !== 'MemberExpression') return;
      const { object, property } = node.callee;
      if (object.type !== 'Identifier' || object.name !== 'Quiz' || property.type !== 'Identifier') return;
      if (property.name !== 'mount' && property.name !== 'register') return;
      const [target, list] = node.arguments;
      if (!target || !list) throw new Error(`${stem}: Quiz.${property.name} with unexpected arguments`);
      calls.push({ code, codeStart, target, list, method: property.name, section: sectionName(target) });
    });
  }
  if (calls.length === 0) return null;

  // Evaluate the scripts in a sandbox that records what each Quiz call received, so that
  // constants, template literals and shared option arrays resolve to plain values.
  const received = [];
  const anything = new Proxy(function () {}, {
    get: (_, key) => (key === Symbol.toPrimitive ? () => '' : anything),
    apply: () => anything,
    construct: () => anything,
    set: () => true,
  });
  const sandbox = new Proxy(
    {
      Quiz: { mount: (_t, list) => received.push(list), register: (_t, list) => received.push(list) },
      window: anything,
      document: anything,
      console,
    },
    { get: (t, key) => (key in t ? t[key] : anything), has: () => true },
  );
  for (const m of scripts) {
    vm.runInNewContext(m[1], sandbox, { timeout: 2000 });
  }
  if (received.length !== calls.length) throw new Error(`${stem}: found ${calls.length} Quiz calls in source but ${received.length} ran`);

  const sections = calls.map((c) => c.section);
  const multi = new Set(sections).size > 1;
  if (multi && new Set(sections).size !== sections.length) throw new Error(`${stem}: duplicate quiz section names ${sections.join(', ')}`);
  const questions = [];
  calls.forEach((call, i) => {
    for (const raw of received[i]) {
      const q = normalizeQuestion(raw, stem);
      if (multi) q.section = call.section;
      questions.push(q);
    }
  });

  // Rewrite the Lesson: each array literal becomes a reference to window.QUIZ, and the quiz file is
  // included right before the first inline script that uses it.
  let out = html;
  const edits = calls
    .map((c) => ({
      start: c.codeStart + c.list.start,
      end: c.codeStart + c.list.end,
      text: multi ? `window.QUIZ.filter((q) => q.section === ${JSON.stringify(c.section)})` : 'window.QUIZ',
    }))
    .sort((a, b) => b.start - a.start);
  for (const e of edits) out = out.slice(0, e.start) + e.text + out.slice(e.end);
  const firstScriptAt = Math.min(...calls.map((c) => c.codeStart));
  const tagStart = out.lastIndexOf('<script', firstScriptAt);
  out = out.slice(0, tagStart) + `<script src="${stem}.quiz.js"></script>\n` + out.slice(tagStart);
  return { html: out, questions };
}

function sectionName(target) {
  if (target.type === 'Literal' && typeof target.value === 'string') {
    const attr = /data-quiz-id="([^"]+)"/.exec(target.value);
    if (attr) return attr[1].replace(/^\d{4}-?/, '') || 'main';
    return target.value;
  }
  return 'main';
}

/** Shape B. Returns null when the Lesson has no markup quiz. */
function migrateMarkup(html, stem) {
  const blocks = findQuizBlocks(html);
  if (blocks.length === 0) return null;
  const multi = blocks.length > 1;
  const questions = [];
  const mounts = [];
  let out = html;
  blocks
    .map((b, i) => ({ ...b, section: `check-${i + 1}` }))
    .reverse()
    .forEach((block) => {
      const qs = parseMarkupQuestions(block.inner, stem).map((q) => (multi ? { ...q, section: block.section } : q));
      questions.unshift(...qs);
      mounts.unshift(block.section);
      out = out.slice(0, block.start) + `<div class="quiz" data-quiz="${block.section}"></div>` + out.slice(block.end);
    });
  const include = `<script src="../assets/quiz.js"></script>`;
  const at = out.indexOf(include);
  if (at < 0) throw new Error(`${stem}: markup quiz without ../assets/quiz.js include`);
  const mountCode = mounts
    .map((section) => {
      const list = multi ? `window.QUIZ.filter((q) => q.section === ${JSON.stringify(section)})` : 'window.QUIZ';
      return `Quiz.mount(document.querySelector('.quiz[data-quiz="${section}"]'), ${list});`;
    })
    .join('\n');
  const insertion = `${include}\n<script src="${stem}.quiz.js"></script>\n<script>\n${mountCode}\n</script>`;
  out = out.slice(0, at) + insertion + out.slice(at + include.length);
  return { html: out, questions };
}

function findQuizBlocks(html) {
  const blocks = [];
  const open = /<div class="quiz">/g;
  let m;
  while ((m = open.exec(html)) !== null) {
    const start = m.index;
    let depth = 0;
    const tag = /<\/?div\b[^>]*>/g;
    tag.lastIndex = start;
    let t;
    while ((t = tag.exec(html)) !== null) {
      depth += t[0].startsWith('</') ? -1 : 1;
      if (depth === 0) {
        blocks.push({ start, end: t.index + t[0].length, inner: html.slice(start + m[0].length, t.index) });
        open.lastIndex = t.index;
        break;
      }
    }
  }
  return blocks;
}

function parseMarkupQuestions(inner, stem) {
  const out = [];
  const re = /<div class="q" data-answer="(\d+)">([\s\S]*?)<div class="q-feedback">([\s\S]*?)<\/div>\s*<\/div>/g;
  let m;
  while ((m = re.exec(inner)) !== null) {
    const [, answer, head, why] = m;
    const prompt = /<p class="q-prompt">([\s\S]*?)<\/p>/.exec(head);
    if (!prompt) throw new Error(`${stem}: question without .q-prompt`);
    const options = [...head.matchAll(/<button>([\s\S]*?)<\/button>/g)].map((b) => b[1].trim());
    if (options.length < 2) throw new Error(`${stem}: question "${prompt[1].slice(0, 40)}" has ${options.length} options`);
    out.push(normalizeQuestion({ q: prompt[1].trim(), options, answer: Number(answer), why: why.trim() }, stem));
  }
  return out;
}

function normalizeQuestion(raw, stem) {
  const text = raw.stem ?? raw.q;
  if (typeof text !== 'string') throw new Error(`${stem}: question without a stem: ${JSON.stringify(raw)}`);
  if (!Array.isArray(raw.options) || !Number.isInteger(raw.answer) || typeof raw.why !== 'string') {
    throw new Error(`${stem}: malformed question ${JSON.stringify(raw).slice(0, 80)}`);
  }
  return { stem: text, options: raw.options.map(String), answer: raw.answer, why: raw.why };
}

function serialize(questions) {
  const body = questions
    .map((q) => {
      const fields = Object.entries(q).map(([k, v]) => `    ${k}: ${JSON.stringify(v)}`);
      return `  {\n${fields.join(',\n')}\n  }`;
    })
    .join(',\n');
  return `[\n${body}\n]`;
}

function walk(node, visit) {
  if (!node || typeof node.type !== 'string') return;
  visit(node);
  for (const key of Object.keys(node)) {
    const child = node[key];
    if (Array.isArray(child)) child.forEach((c) => walk(c, visit));
    else if (child && typeof child.type === 'string') walk(child, visit);
  }
}
