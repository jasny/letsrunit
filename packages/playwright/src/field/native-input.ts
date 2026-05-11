import { isFileValue } from '@letsrunit/utils';
import type { Loc, SetOptions, Value } from './types';

export async function setNativeInput({ el, tag }: Loc, value: Value, options?: SetOptions): Promise<boolean> {
  if (tag !== 'input' && tag !== 'textarea') return false;
  if (isFileValue(value)) {
    throw new Error('File values are only supported for input[type="file"]');
  }

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
