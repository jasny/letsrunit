import { setFieldValue } from '@letsrunit/playwright';
import { expect, test } from '@sand4rt/experimental-ct-angular';
import { resolve } from 'node:path';
import { NzFileInputFixture } from '../../src/ng-zorro-antd/inputs';

const uploadA = resolve(process.cwd(), 'tests/fixtures/upload-a.txt');
const uploadB = resolve(process.cwd(), 'tests/fixtures/upload-b.txt');

test('Nz file input', async ({ mount, page }) => {
  await mount(NzFileInputFixture);

  const root = page.locator('nz-upload');

  await setFieldValue(root, { kind: 'file', paths: [uploadA] }, { timeout: 1000 });
  await expect(page.getByLabel('result')).toContainText('upload-a.txt');
});

test('Nz multi-file input', async ({ mount, page }) => {
  await mount(NzFileInputFixture);

  const root = page.locator('nz-upload');

  await setFieldValue(root, { kind: 'file', paths: [uploadA, uploadB] }, { timeout: 1000 });
  await expect(page.getByLabel('result')).toContainText('upload-a.txt');
  await expect(page.getByLabel('result')).toContainText('upload-b.txt');
});
