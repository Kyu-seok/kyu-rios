import { createEmptyCard, fsrs, Rating, type Card, type Grade } from 'ts-fsrs';
import { escapeAttr as escapeHtml } from '../lib/escape';
import type { ReviewCard, ReviewData } from '../lib/types';
import { loadProgress, saveProgress, serializeProgress, parseProgress, type Progress } from './progress';

const AHEAD_BATCH = 10;

/** The Review page: counts, Topic filter, one card at a time, export and import of Progress. */
export async function mountReview(root: HTMLElement, base: string): Promise<void> {
  const data: ReviewData = await fetch(`${base}review.json`).then((r) => r.json());
  const scheduler = fsrs();
  let progress = loadProgress();
  let topicFilter = new URLSearchParams(location.search).get('topic') ?? '';
  if (!data.cards.some((c) => c.topic === topicFilter)) topicFilter = '';
  let queue: ReviewCard[] = [];
  let current: ReviewCard | undefined;
  let ahead = false;
  let done = 0;

  const topics = [...new Map(data.cards.map((c) => [c.topic, c.topicTitle])).entries()];
  const stateOf = (card: ReviewCard): Card => progress[card.id] ?? createEmptyCard(new Date());
  /** Cards absent from Progress are new and due now; others are due once their FSRS due date has passed. */
  const isDue = (card: ReviewCard, now: Date) => {
    const state = progress[card.id];
    return !state || state.due.getTime() <= now.getTime();
  };
  const selected = () => data.cards.filter((c) => !topicFilter || c.topic === topicFilter);
  const dueCards = () => {
    const now = new Date();
    return selected().filter((c) => isDue(c, now));
  };

  function renderOverview() {
    const now = new Date();
    const due = dueCards();
    root.innerHTML = '';
    const stats = el('div', 'review-stats');
    stats.innerHTML = `<div><div class="big" data-testid="due-total">${due.length}</div><div class="muted">due now${topicFilter ? ` in ${escapeHtml(titleOf(topicFilter))}` : ''}</div></div>
      <div class="muted">${selected().length} cards in selection · ${data.cards.length} in total</div>`;
    const perTopic = el('ul', 'review-topics');
    perTopic.setAttribute('aria-label', 'Due per Topic');
    for (const [slug, title] of topics) {
      const n = data.cards.filter((c) => c.topic === slug && isDue(c, now)).length;
      const li = document.createElement('li');
      li.innerHTML = `${escapeHtml(title)}: <b data-testid="due-topic-${escapeHtml(slug)}">${n}</b>`;
      perTopic.append(li);
    }
    const controls = el('div', 'review-controls');
    const select = document.createElement('select');
    select.dataset.testid = 'topic-filter';
    select.setAttribute('aria-label', 'Filter by Topic');
    select.innerHTML = `<option value="">All Topics</option>${topics.map(([slug, title]) => `<option value="${escapeHtml(slug)}"${slug === topicFilter ? ' selected' : ''}>${escapeHtml(title)}</option>`).join('')}`;
    select.addEventListener('change', () => {
      topicFilter = select.value;
      const url = new URL(location.href);
      if (topicFilter) url.searchParams.set('topic', topicFilter);
      else url.searchParams.delete('topic');
      history.replaceState(null, '', url);
      renderOverview();
    });
    controls.append(select);
    if (due.length > 0) {
      const start = button('Start Review', 'button', () => startReview(due, false));
      start.dataset.testid = 'start-review';
      controls.append(start);
    }
    root.append(stats, perTopic, controls);

    if (due.length === 0) {
      const empty = el('div', 'review-empty');
      empty.dataset.testid = 'empty-state';
      const soonest = selected()
        .map((c) => ({ c, due: stateOf(c).due }))
        .sort((a, b) => a.due.getTime() - b.due.getTime())
        .slice(0, AHEAD_BATCH);
      empty.innerHTML = `<p><b>Nothing is due${topicFilter ? ` in ${escapeHtml(titleOf(topicFilter))}` : ''}.</b> ${soonest.length ? `The next card is due ${escapeHtml(relativeDate(soonest[0]!.due))}.` : 'There are no cards in this selection.'}</p>`;
      if (soonest.length) {
        const aheadBtn = button(`Review ahead (${soonest.length} soonest cards)`, 'button secondary', () => startReview(soonest.map((s) => s.c), true));
        aheadBtn.dataset.testid = 'review-ahead';
        empty.append(aheadBtn);
      }
      root.append(empty);
    }
    root.append(importExport());
  }

  function startReview(cards: ReviewCard[], isAhead: boolean) {
    queue = shuffle([...cards]);
    ahead = isAhead;
    done = 0;
    next();
  }

  function next() {
    current = queue.shift();
    if (!current) return renderFinished();
    renderCard(current);
  }

  function renderCard(card: ReviewCard) {
    root.innerHTML = '';
    const box = el('section', 'review-card');
    box.setAttribute('aria-live', 'polite');
    box.dataset.cardId = card.id;
    const where = el('p', 'where');
    where.innerHTML = `${escapeHtml(card.topicTitle)} · <a href="${base}${card.lessonUrl}">${escapeHtml(card.lessonTitle)}</a> · ${done + 1} of ${done + 1 + queue.length}${ahead ? ' · reviewing ahead' : ''}`;
    const stem = el('p', 'stem');
    stem.dataset.testid = 'card-stem';
    stem.innerHTML = card.stem;
    const options = el('div', 'options');
    options.setAttribute('role', 'group');
    options.setAttribute('aria-label', 'Options');
    const buttons = card.options.map((text, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'option';
      b.dataset.testid = 'option';
      b.innerHTML = text;
      b.addEventListener('click', () => answer(card, i, buttons, box));
      options.append(b);
      return b;
    });
    box.append(where, stem, options);
    root.append(box);
  }

  function answer(card: ReviewCard, picked: number, buttons: HTMLButtonElement[], box: HTMLElement) {
    buttons.forEach((b) => (b.disabled = true));
    buttons[card.answer]!.classList.add('is-right');
    const correct = picked === card.answer;
    if (!correct) buttons[picked]!.classList.add('is-wrong');
    const why = el('div', 'why');
    why.dataset.testid = 'why';
    why.innerHTML = `<span class="verdict ${correct ? 'ok' : 'no'}">${correct ? 'Correct.' : 'Not quite.'}</span> ${card.why}`;
    const grades = el('div', 'grades');
    if (correct) {
      const preview = scheduler.repeat(stateOf(card), new Date());
      for (const [grade, label] of [[Rating.Hard, 'Hard'], [Rating.Good, 'Good'], [Rating.Easy, 'Easy']] as const) {
        const b = button(label, 'button', () => record(card, grade));
        b.dataset.testid = `grade-${label.toLowerCase()}`;
        b.insertAdjacentHTML('beforeend', `<small>${escapeHtml(relativeDate(preview[grade].card.due))}</small>`);
        grades.append(b);
      }
    } else {
      record(card, Rating.Again, false);
      grades.innerHTML = `<span class="muted" data-testid="graded-again">Graded <b>Again</b>: this card comes back soon.</span>`;
      const nextBtn = button('Next', 'button', next);
      nextBtn.dataset.testid = 'next';
      grades.append(nextBtn);
    }
    box.append(why, grades);
  }

  function record(card: ReviewCard, grade: Grade, advance = true) {
    const result = scheduler.next(stateOf(card), new Date(), grade);
    progress = { ...progress, [card.id]: result.card };
    saveProgress(progress);
    done++;
    if (advance) next();
  }

  function renderFinished() {
    root.innerHTML = '';
    const box = el('div', 'review-empty');
    box.dataset.testid = 'finished';
    box.innerHTML = `<p><b>Done.</b> You reviewed ${done} card${done === 1 ? '' : 's'}.</p>`;
    const back = button('Back to overview', 'button', renderOverview);
    back.dataset.testid = 'back';
    box.append(back);
    root.append(box);
  }

  function importExport(): HTMLElement {
    const io = el('div', 'review-io');
    const exportBtn = button('Export Progress', 'button secondary', () => {
      const blob = new Blob([serializeProgress(progress)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `kyu-rious-progress-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
    });
    exportBtn.dataset.testid = 'export';
    const importLabel = document.createElement('label');
    importLabel.className = 'button secondary';
    importLabel.textContent = 'Import Progress';
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    input.className = 'sr-only';
    input.dataset.testid = 'import';
    input.addEventListener('change', async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const imported = parseProgress(await file.text());
        progress = { ...progress, ...imported };
        saveProgress(progress);
        renderOverview();
        note(`Imported ${Object.keys(imported).length} cards of Progress.`);
      } catch (err) {
        note(`Could not import: ${(err as Error).message}`);
      }
    });
    importLabel.append(input);
    const noteEl = el('span', 'review-note');
    noteEl.dataset.testid = 'io-note';
    noteEl.textContent = `${Object.keys(progress).length} cards have Progress in this browser.`;
    io.append(exportBtn, importLabel, noteEl);
    return io;
  }

  function note(text: string) {
    const n = root.querySelector('[data-testid="io-note"]');
    if (n) n.textContent = text;
  }

  function titleOf(slug: string): string {
    return topics.find(([s]) => s === slug)?.[1] ?? slug;
  }

  renderOverview();
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className: string): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  e.className = className;
  return e;
}

function button(label: string, className: string, onClick: () => void): HTMLButtonElement {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = className;
  b.textContent = label;
  b.addEventListener('click', onClick);
  return b;
}

function shuffle<T>(a: T[]): T[] {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function relativeDate(d: Date): string {
  const days = Math.round((d.getTime() - Date.now()) / 86_400_000);
  if (days <= 0) {
    const minutes = Math.max(1, Math.round((d.getTime() - Date.now()) / 60_000));
    return minutes < 60 ? `in ${minutes} min` : `in ${Math.round(minutes / 60)} h`;
  }
  if (days === 1) return 'tomorrow';
  if (days < 30) return `in ${days} days`;
  if (days < 365) return `in ${Math.round(days / 30)} months`;
  return `in ${(days / 365).toFixed(1)} years`;
}

export type { Progress };
