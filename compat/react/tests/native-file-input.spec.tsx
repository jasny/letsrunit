import { setFieldValue } from '@letsrunit/playwright';
import { expect, test } from '@playwright/experimental-ct-react';
import type { Locator } from '@playwright/test';
import { resolve } from 'node:path';

const uploadA = resolve(process.cwd(), 'tests/fixtures/upload-a.txt');
const uploadB = resolve(process.cwd(), 'tests/fixtures/upload-b.txt');

async function selectedFileNames(locator: Locator): Promise<string[]> {
  return locator.evaluate((input) =>
    Array.from((input as HTMLInputElement).files ?? [], (file) => file.name),
  );
}

test.describe('Native file inputs', () => {
  test('sets file input', async ({ mount, page }) => {
    await mount(
      <form>
        <label htmlFor="upload">Upload</label>
        <input id="upload" type="file" />
      </form>,
    );

    const input = page.getByLabel('Upload');

    await setFieldValue(input, { kind: 'file', paths: [uploadA] }, { timeout: 500 });
    await expect.poll(() => selectedFileNames(input)).toEqual(['upload-a.txt']);
  });

  test('sets multi-file input', async ({ mount, page }) => {
    await mount(
      <form>
        <label htmlFor="uploads">Uploads</label>
        <input id="uploads" type="file" multiple />
      </form>,
    );

    const input = page.getByLabel('Uploads');

    await setFieldValue(input, { kind: 'file', paths: [uploadA, uploadB] }, { timeout: 500 });
    await expect.poll(() => selectedFileNames(input)).toEqual(['upload-a.txt', 'upload-b.txt']);
  });
});
