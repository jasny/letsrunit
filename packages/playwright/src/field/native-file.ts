import { isFileValue } from '@letsrunit/utils';
import type { Loc, SetOptions, Value } from './types';

export async function setNativeFile({ el, tag, type }: Loc, value: Value, options?: SetOptions): Promise<boolean> {
  if (tag !== 'input' || type !== 'file') return false;
  if (!isFileValue(value)) return false;

  await el.setInputFiles(value.paths.length === 1 ? value.paths[0] : value.paths, options);
  return true;
}
