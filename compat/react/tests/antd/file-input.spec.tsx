import { setFieldValue } from '@letsrunit/playwright';
import { Input } from 'antd';
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

test('AntDesign file input', async ({ mount, page }) => {
  await mount(<Input aria-label="Upload" type="file" />);

  const input = page.getByLabel('Upload');

  await setFieldValue(input, { kind: 'file', paths: [uploadA] }, { timeout: 500 });
  await expect.poll(() => selectedFileNames(input)).toEqual(['upload-a.txt']);
});

test('AntDesign multi-file input', async ({ mount, page }) => {
  await mount(<Input aria-label="Uploads" type="file" multiple />);

  const input = page.getByLabel('Uploads');

  await setFieldValue(input, { kind: 'file', paths: [uploadA, uploadB] }, { timeout: 500 });
  await expect.poll(() => selectedFileNames(input)).toEqual(['upload-a.txt', 'upload-b.txt']);
});
