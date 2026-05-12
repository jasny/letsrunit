import { isFileValue } from '@letsrunit/utils';
import type { Locator } from '@playwright/test';
import type { Loc, SetOptions, Value } from './types';

async function getFileInput({ el, tag, type }: Loc): Promise<Locator | null> {
  if (tag === 'input' && type === 'file') return el;

  const inputs = el.locator('input[type="file"]');
  if ((await inputs.count()) === 0) return null;
  return inputs.first();
}

export async function setNativeFile(loc: Loc, value: Value, options?: SetOptions): Promise<boolean> {
  const input = await getFileInput(loc);
  if (!input) return false;
  if (!isFileValue(value)) {
    throw new Error('File inputs only support file values');
  }

  await input.setInputFiles(value.paths.length === 1 ? value.paths[0] : value.paths, options);
  return true;
}
