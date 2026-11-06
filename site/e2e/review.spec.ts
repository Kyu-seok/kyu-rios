import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

type Card = { id: string; answer: number; topic: string };

async function cards(page: Page): Promise<Map<string, Card>> {
  const data = (await (await page.request.get('./review.json')).json()) as { cards: Card[] };
  return new Map(data.cards.map((c) => [c.id, c]));
}

async function currentCard(page: Page, byId: Map<string, Card>): Promise<Card> {
  const id = await page.locator('[data-card-id]').getAttribute('data-card-id');
  const card = byId.get(id!);
  if (!card) throw new Error(`unknown card ${id}`);
  return card;
}

test.describe('Review', () => {
  test('shows due counts in total and per Topic, and filters by Topic', async ({ page }) => {
    await page.goto('./review/');
    const total = Number(await page.getByTestId('due-total').textContent());
    const kafka = Number(await page.getByTestId('due-topic-kafka').textContent());
    expect(total).toBeGreaterThan(kafka);
    expect(kafka).toBeGreaterThan(0);
    await page.getByTestId('topic-filter').selectOption('kafka');
    await expect(page.getByTestId('due-total')).toHaveText(String(kafka));
    await expect(page).toHaveURL(/topic=kafka/);
  });

  test('a Topic page starts a Review of that Topic', async ({ page }) => {
    await page.goto('./topics/kafka/');
    await page.getByTestId('review-topic').click();
    await expect(page).toHaveURL(/review\/\?topic=kafka/);
    await expect(page.getByTestId('topic-filter')).toHaveValue('kafka');
  });

  test('a wrong pick is graded Again; a right pick offers Hard, Good and Easy and shows the why', async ({ page }) => {
    const byId = await cards(page);
    await page.goto('./review/?topic=kafka');
    await page.getByTestId('start-review').click();

    let card = await currentCard(page, byId);
    const wrong = (card.answer + 1) % (await page.getByTestId('option').count());
    await page.getByTestId('option').nth(wrong).click();
    await expect(page.getByTestId('why')).toBeVisible();
    await expect(page.getByTestId('graded-again')).toBeVisible();
    await expect(page.getByTestId('grade-good')).toHaveCount(0);
    await page.getByTestId('next').click();

    card = await currentCard(page, byId);
    await page.getByTestId('option').nth(card.answer).click();
    await expect(page.getByTestId('why')).toBeVisible();
    await expect(page.getByTestId('grade-hard')).toBeVisible();
    await expect(page.getByTestId('grade-good')).toBeVisible();
    await expect(page.getByTestId('grade-easy')).toBeVisible();
    await page.getByTestId('grade-good').click();
  });

  test('Progress survives a reload', async ({ page }) => {
    const byId = await cards(page);
    await page.goto('./review/?topic=kafka');
    const before = Number(await page.getByTestId('due-total').textContent());
    await page.getByTestId('start-review').click();
    const card = await currentCard(page, byId);
    await page.getByTestId('option').nth(card.answer).click();
    await page.getByTestId('grade-easy').click();
    await page.reload();
    await expect(page.getByTestId('due-total')).toHaveText(String(before - 1));
  });

  test('export then import in a fresh browser restores Progress', async ({ page, browser, baseURL }) => {
    const byId = await cards(page);
    await page.goto('./review/?topic=kafka');
    const before = Number(await page.getByTestId('due-total').textContent());
    await page.getByTestId('start-review').click();
    const card = await currentCard(page, byId);
    await page.getByTestId('option').nth(card.answer).click();
    await page.getByTestId('grade-good').click();
    await page.goto('./review/?topic=kafka');
    const [download] = await Promise.all([page.waitForEvent('download'), page.getByTestId('export').click()]);
    const file = await download.path();
    const exported = JSON.parse(readFileSync(file!, 'utf8'));
    expect(exported.cards[card.id]).toBeTruthy();

    const fresh = await browser.newContext();
    const other = await fresh.newPage();
    await other.goto(`${baseURL}review/?topic=kafka`);
    await expect(other.getByTestId('due-total')).toHaveText(String(before));
    await other.getByTestId('import').setInputFiles(file!);
    await expect(other.getByTestId('io-note')).toHaveText(/Imported 1 card/);
    await expect(other.getByTestId('due-total')).toHaveText(String(before - 1));
    await fresh.close();
  });

  test('an empty queue says so and offers to review ahead', async ({ page }) => {
    const byId = await cards(page);
    await page.goto('./review/?topic=kafka');
    const total = Number(await page.getByTestId('due-total').textContent());
    await page.getByTestId('start-review').click();
    for (let i = 0; i < total; i++) {
      const card = await currentCard(page, byId);
      await page.getByTestId('option').nth(card.answer).click();
      await page.getByTestId('grade-easy').click();
    }
    await expect(page.getByTestId('finished')).toBeVisible();
    await page.getByTestId('back').click();
    await expect(page.getByTestId('due-total')).toHaveText('0');
    await expect(page.getByTestId('empty-state')).toContainText('Nothing is due');
    await page.getByTestId('review-ahead').click();
    await expect(page.locator('[data-card-id]')).toBeVisible();
  });
});
