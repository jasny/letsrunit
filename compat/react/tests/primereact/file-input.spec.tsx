import { setFieldValue } from '@letsrunit/playwright';
import { expect, test } from '@playwright/experimental-ct-react';
import { resolve } from 'node:path';
import { PrimeReactFileInput } from '../../src/primereact/inputs';

const uploadA = resolve(process.cwd(), 'tests/fixtures/upload-a.txt');
const uploadB = resolve(process.cwd(), 'tests/fixtures/upload-b.txt');

test('PrimeReact file input', async ({ mount, page }) => {
  await mount(<PrimeReactFileInput />);

  const root = page.locator('.p-fileupload, .p-fileupload-basic');

  await setFieldValue(root, { kind: 'file', paths: [uploadA] }, { timeout: 1000 });
  await expect(page.getByLabel('result')).toContainText('upload-a.txt');
});

test('PrimeReact multi-file input', async ({ mount, page }) => {
  await mount(<PrimeReactFileInput multiple />);

  const root = page.locator('.p-fileupload, .p-fileupload-basic');

  await setFieldValue(root, { kind: 'file', paths: [uploadA, uploadB] }, { timeout: 1000 });
  await expect(page.getByLabel('result')).toContainText('upload-a.txt');
  await expect(page.getByLabel('result')).toContainText('upload-b.txt');
});
