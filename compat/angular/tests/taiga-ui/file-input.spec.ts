import { setFieldValue } from '@letsrunit/playwright';
import { expect, test } from '@sand4rt/experimental-ct-angular';
import type { Locator } from '@playwright/test';
import { resolve } from 'node:path';
import { TaigaFileInputFixture } from '../../src/taiga-ui/inputs';

const uploadA = resolve(process.cwd(), 'tests/fixtures/upload-a.txt');
const uploadB = resolve(process.cwd(), 'tests/fixtures/upload-b.txt');

async function selectedFileNames(locator: Locator): Promise<string[]> {
  return locator.evaluate((input) =>
    Array.from((input as HTMLInputElement).files ?? [], (file) => file.name),
  );
}

test('Taiga file input', async ({ mount, page }) => {
  await mount(TaigaFileInputFixture);

  const input = page.getByLabel('upload');
  const root = page.locator('tui-textfield');

  await setFieldValue(root, { kind: 'file', paths: [uploadA] }, { timeout: 1000 });
  await expect.poll(() => selectedFileNames(input)).toEqual(['upload-a.txt']);
});

test('Taiga multi-file input', async ({ mount, page }) => {
  await mount(TaigaFileInputFixture);

  const input = page.getByLabel('upload');
  const root = page.locator('tui-textfield');

  await setFieldValue(root, { kind: 'file', paths: [uploadA, uploadB] }, { timeout: 1000 });
  await expect.poll(() => selectedFileNames(input)).toEqual(['upload-a.txt', 'upload-b.txt']);
});
