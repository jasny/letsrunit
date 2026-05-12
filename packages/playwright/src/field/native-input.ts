import { isFileValue } from '@letsrunit/utils';
import type { Loc, SetOptions, Value } from './types';

export async function setNativeInput({ el, tag, type }: Loc, value: Value, options?: SetOptions): Promise<boolean> {
  if (tag !== 'input' && tag !== 'textarea') return false;
  if (type === 'file') return false;
  if (isFileValue(value)) return false;

  if (value === null) {
    await el.clear(options);
    return true;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    await el.fill(String(value), options);
    return true;
  }

  return false;
}
