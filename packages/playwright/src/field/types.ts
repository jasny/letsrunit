import type { FileValue, Range, Scalar } from '@letsrunit/utils';
import type { Locator } from '@playwright/test';

export interface SetOptions {
  force?: boolean;
  noWaitAfter?: boolean;
  timeout?: number;
}

export type Value = Scalar | Scalar[] | Range | FileValue | boolean | null;

export interface Loc {
  el: Locator;
  tag: string;
  type: string | null;
}
