import { setFieldValue } from '@letsrunit/playwright';
import { expect, test } from '@sand4rt/experimental-ct-angular';
import { resolve } from 'node:path';
import { PrimeNgFileInputFixture } from '../../src/primeng/inputs';

const uploadA = resolve(process.cwd(), 'tests/fixtures/upload-a.txt');
const uploadB = resolve(process.cwd(), 'tests/fixtures/upload-b.txt');

test('PrimeNG file input', async ({ mount, page }) => {
  await mount(PrimeNgFileInputFixture);

  const root = page.locator('.p-fileupload');

  await setFieldValue(root, { kind: 'file', paths: [uploadA] }, { timeout: 1000 });
  await expect(root).toContainText('upload-a.txt');
});

test('PrimeNG multi-file input', async ({ mount, page }) => {
  await mount(PrimeNgFileInputFixture);

  const root = page.locator('.p-fileupload');

  await setFieldValue(root, { kind: 'file', paths: [uploadA, uploadB] }, { timeout: 1000 });
  await expect(root).toContainText('upload-a.txt');
  await expect(root).toContainText('upload-b.txt');
});
