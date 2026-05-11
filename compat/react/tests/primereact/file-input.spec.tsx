import { setFieldValue } from '@letsrunit/playwright';
import { expect, test } from '@playwright/experimental-ct-react';
import type { Locator } from '@playwright/test';
import { resolve } from 'node:path';
import { PrimeReactFileInput } from '../../src/primereact/inputs';

const uploadA = resolve(process.cwd(), 'tests/fixtures/upload-a.txt');
const uploadB = resolve(process.cwd(), 'tests/fixtures/upload-b.txt');

async function selectedFileNames(locator: Locator): Promise<string[]> {
  return locator.evaluate((input) =>
    Array.from((input as HTMLInputElement).files ?? [], (file) => file.name),
  );
}

test('PrimeReact file input', async ({ mount, page }) => {
  await mount(<PrimeReactFileInput />);

  const input = page.getByLabel('Upload');

  await setFieldValue(input, { kind: 'file', paths: [uploadA] }, { timeout: 1000 });
  await expect.poll(() => selectedFileNames(input)).toEqual(['upload-a.txt']);
});

test('PrimeReact multi-file input', async ({ mount, page }) => {
  await mount(<PrimeReactFileInput multiple />);

  const input = page.getByLabel('Upload');

  await setFieldValue(input, { kind: 'file', paths: [uploadA, uploadB] }, { timeout: 1000 });
  await expect.poll(() => selectedFileNames(input)).toEqual(['upload-a.txt', 'upload-b.txt']);
});
