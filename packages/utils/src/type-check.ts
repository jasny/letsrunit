import type { FileValue, Predicate, Range, Scalar } from './types';

export function isBinary(input: unknown): input is Uint8Array {
  return input instanceof Uint8Array;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  // Preserve well-known special objects
  if (value instanceof Date) return false;
  if (value instanceof RegExp) return false;
  if (value instanceof Uint8Array) return false;
  return Object.getPrototypeOf(value) === Object.prototype;
}

export function isEntity<T extends { id: any }>(value: unknown): value is T {
  return typeof value === 'object' && value !== null && 'id' in value;
}

export function isRange(value: unknown): value is Range;
export function isRange<T extends Scalar>(value: unknown, isT: Predicate<T>): value is Range<T>;
export function isRange<T extends Scalar>(value: unknown, isT?: Predicate<T>): value is Range<T> {
  if (!isRecord(value) || !('from' in value) || !('to' in value)) return false;
  return !isT || (isT(value.from) && isT(value.to));
}

export function isArray<T>(value: unknown): value is unknown[];
export function isArray<T>(value: unknown, isT: Predicate<T>): value is T[];
export function isArray<T>(value: unknown, isT?: Predicate<T>): value is T[] {
  if (!Array.isArray(value)) return false;
  return isT ? value.every(isT) : true;
}

export const isDate: Predicate<Date> = (v): v is Date => v instanceof Date;
export const isString: Predicate<string> = (v): v is string => typeof v === 'string';

export function isFileValue(value: unknown): value is FileValue {
  if (!isRecord(value) || value.kind !== 'file' || !('paths' in value)) return false;
  return isArray(value.paths, isString);
}

/** @deprecated */
export function isDateRange(value: unknown): value is Range<Date> {
  return isRange(value, isDate);
}

/** @deprecated */
export function isDateArray(value: unknown): value is Date[] {
  return isArray(value, isDate);
}
