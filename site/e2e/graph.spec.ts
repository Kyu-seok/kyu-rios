import { expect, test, type Page } from '@playwright/test';

async function graphReady(page: Page) {
  await expect(page.locator('[data-graph] canvas')).toBeVisible();
  await expect(page.locator('[data-graph]')).toHaveAttribute('data-visible-nodes', /^[1-9]\d*$/);
}

test.describe('Graph', () => {
  test('filters by Topic hide and show its Nodes', async ({ page }) => {
    await page.goto('./');
    await graphReady(page);
    const nodes = page.locator('[data-testid="visible-nodes"] li');
    const before = await nodes.count();
    expect(await page.locator('[data-testid="visible-nodes"] li[data-node-id^="kafka"]').count()).toBeGreaterThan(0);

    await page.getByTestId('filter-topic-kafka').uncheck();
    await expect(page.locator('[data-testid="visible-nodes"] li[data-node-id^="kafka"]')).toHaveCount(0);
    expect(await nodes.count()).toBeLessThan(before);

    await page.getByTestId('filter-topic-kafka').check();
    expect(await page.locator('[data-testid="visible-nodes"] li[data-node-id^="kafka"]').count()).toBeGreaterThan(0);
    expect(await nodes.count()).toBe(before);
  });

  test('filters by Relationship type hide and show its Relationships', async ({ page }) => {
    await page.goto('./');
    await graphReady(page);
    const graph = page.locator('[data-graph]');
    const data = (await (await page.request.get('./graph.json')).json()) as { relationships: Array<{ type: string }> };
    const total = data.relationships.length;
    const mentions = data.relationships.filter((r) => r.type === 'mentions').length;
    expect(mentions).toBeGreaterThan(0);
    await expect(graph).toHaveAttribute('data-visible-relationships', String(total));

    await page.getByTestId('filter-type-mentions').uncheck();
    await expect(graph).toHaveAttribute('data-visible-relationships', String(total - mentions));

    await page.getByTestId('filter-type-mentions').check();
    await expect(graph).toHaveAttribute('data-visible-relationships', String(total));
  });

  test('clicking a Node opens its page', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto('./');
    await graphReady(page);
    await page.locator('[data-graph] canvas').scrollIntoViewIfNeeded();
    const target = await page.evaluate(() => {
      const el = document.querySelector('[data-graph]') as HTMLElement & { __graph: { settle(): void; positions(): Array<{ id: string; x: number; y: number; r: number }> } };
      el.__graph.settle();
      return el.__graph.positions().find((p) => p.id === 'kafka')!;
    });
    expect(target).toBeTruthy();
    await page.mouse.click(target.x, target.y);
    await expect(page).toHaveURL(/\/kyu-rios\/topics\/kafka\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Kafka');
  });

  test('a Lesson page keeps its own Quiz and gains the site header and local Graph', async ({ page }) => {
    await page.goto('./topics/kafka/lessons/0001-where-does-an-event-land.html');
    await expect(page.locator('.rios-nav a[rel="next"]')).toHaveAttribute('href', /0002-who-reads-which-partition\.html$/);
    await expect(page.locator('.rios-nav .rios-nav-topic')).toHaveAttribute('href', /\/kyu-rios\/topics\/kafka\/$/);
    await expect(page.locator('#quiz .q-opt').first()).toBeVisible();
    await page.locator('.rios-local-graph iframe').scrollIntoViewIfNeeded();
    const frame = page.frameLocator('.rios-local-graph iframe');
    await expect(frame.locator('[data-embed-graph]')).toHaveAttribute('data-visible-nodes', /^[1-9]\d*$/);
  });
});
