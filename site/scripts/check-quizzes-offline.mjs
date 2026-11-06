#!/usr/bin/env node
// Opens every Lesson straight from disk (file://) in headless Chromium and checks that its Quiz
// renders as many questions as its `.quiz.js` declares, and that answering one shows the "why".
// Usage: node scripts/check-quizzes-offline.mjs [topicsDir]

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import vm from 'node:vm';
import { chromium } from '@playwright/test';

const topicsDir = resolve(process.argv[2] ?? join(import.meta.dirname, '..', '..', 'topics'));
const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
let failures = 0;

for (const slug of readdirSync(topicsDir).sort()) {
  const lessonsDir = join(topicsDir, slug, 'lessons');
  if (!existsSync(lessonsDir)) continue;
  for (const file of readdirSync(lessonsDir).filter((f) => f.endsWith('.quiz.js')).sort()) {
    const stem = file.slice(0, -'.quiz.js'.length);
    const sandbox = { window: {} };
    vm.runInNewContext(readFileSync(join(lessonsDir, file), 'utf8'), sandbox);
    const expected = sandbox.window.QUIZ.length;
    errors.length = 0;
    await page.goto(pathToFileURL(join(lessonsDir, `${stem}.html`)).href);
    const rendered = (await page.locator('.quiz-q').count()) || (await page.locator('.q-stem, .q-prompt').count());
    const buttons = page.locator('.quiz-opts button, .q-options button, .q-opt, .q-option');
    const verdicts = page.getByText(/^(Correct|Not quite)\.?\s*$/);
    const before = await verdicts.count();
    await buttons.first().click();
    const after = await verdicts.count();
    const ok = rendered === expected && after === before + 1 && errors.length === 0;
    if (!ok) failures++;
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${slug}/${stem}: ${rendered}/${expected} questions, why shown: ${after === before + 1}${errors.length ? `, errors: ${errors.join(' | ')}` : ''}`);
  }
}
await browser.close();
if (failures) {
  console.error(`${failures} Lesson(s) failed`);
  process.exit(1);
}
