import { setFieldValue } from '@letsrunit/playwright';
import { Input } from '@mui/material';
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

test('MUI file input', async ({ mount, page }) => {
  await mount(<Input type="file" inputProps={{ 'aria-label': 'upload' }} />);

  const input = page.getByLabel('upload');

  await setFieldValue(input, { kind: 'file', paths: [uploadA] }, { timeout: 1000 });
  await expect.poll(() => selectedFileNames(input)).toEqual(['upload-a.txt']);
});

test('MUI multi-file input', async ({ mount, page }) => {
  await mount(<Input type="file" inputProps={{ 'aria-label': 'uploads', multiple: true }} />);

  const input = page.getByLabel('uploads');

  await setFieldValue(input, { kind: 'file', paths: [uploadA, uploadB] }, { timeout: 1000 });
  await expect.poll(() => selectedFileNames(input)).toEqual(['upload-a.txt', 'upload-b.txt']);
});
