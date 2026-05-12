import { setFieldValue } from '@letsrunit/playwright';
import { expect, test } from '@playwright/experimental-ct-react';
import { resolve } from 'node:path';
import { AntdUpload } from '../../src/antd/upload';

const uploadA = resolve(process.cwd(), 'tests/fixtures/upload-a.txt');
const uploadB = resolve(process.cwd(), 'tests/fixtures/upload-b.txt');

test('AntDesign file input', async ({ mount, page }) => {
  await mount(<AntdUpload />);
  const root = page.locator('.ant-upload-wrapper').first();

  await setFieldValue(root, { kind: 'file', paths: [uploadA] }, { timeout: 500 });
  await expect(root).toContainText('upload-a.txt');
});

test('AntDesign multi-file input', async ({ mount, page }) => {
  await mount(<AntdUpload multiple />);
  const root = page.locator('.ant-upload-wrapper').first();

  await setFieldValue(root, { kind: 'file', paths: [uploadA, uploadB] }, { timeout: 500 });
  await expect(root).toContainText('upload-a.txt');
  await expect(root).toContainText('upload-b.txt');
});
