import { setFieldValue } from '@letsrunit/playwright';
import { expect, test } from '@playwright/experimental-ct-react';
import { PrimeReactChips } from '../../src/primereact/inputs';

test('PrimeReact chips from a single string', async ({ mount, page }) => {
  await mount(<PrimeReactChips />);

  const root = page.locator('.p-chips');

  await setFieldValue(root, 'hello', { timeout: 1000 });
  await expect(page.getByLabel('result')).toContainText('hello');
});

test('PrimeReact chips from an array of strings', async ({ mount, page }) => {
  await mount(<PrimeReactChips />);

  const root = page.locator('.p-chips');

  await setFieldValue(root, ['hello', 'world'], { timeout: 1000 });
  await expect(page.getByLabel('result')).toContainText('hello');
  await expect(page.getByLabel('result')).toContainText('world');
});
