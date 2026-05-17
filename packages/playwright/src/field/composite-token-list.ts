import { isArray, isString } from '@letsrunit/utils';
import type { Locator } from '@playwright/test';
import type { Loc, SetOptions, Value } from './types';

function toTokenValues(value: Value): string[] | null {
  if (typeof value === 'string') return [value];
  if (isArray(value, isString)) return value;
  return null;
}

async function getListbox(el: Locator, options?: SetOptions): Promise<Locator | null> {
  const role = await el.getAttribute('role', options).catch(() => null);
  if (role === 'listbox') return el;

  const listboxes = el.locator('[role="listbox"]');
  if ((await listboxes.count()) === 0) return null;
  return listboxes.first();
}

async function getTextInput(el: Locator): Promise<Locator | null> {
  const inputs = el.locator('input[type="text"], input:not([type])');
  if ((await inputs.count()) === 0) return null;
  return inputs.first();
}

async function looksLikeTokenList(el: Locator, options?: SetOptions): Promise<boolean> {
  const listbox = await getListbox(el, options);
  if (!listbox) return false;

  const input = await getTextInput(el);
  if (!input) return false;

  return true;
}

async function clearExistingTokens(listbox: Locator, input: Locator, options?: SetOptions): Promise<void> {
  const optionsLoc = listbox.locator('[role="option"]');

  await input.focus(options).catch(() => null);

  let previousCount = -1;
  while (true) {
    const count = await optionsLoc.count();
    if (count === 0 || count === previousCount) return;

    previousCount = count;
    await input.press('Backspace', options);
  }
}

export async function setCompositeTokenList({ el }: Loc, value: Value, options?: SetOptions): Promise<boolean> {
  const values = toTokenValues(value);
  if (!values) return false;
  if (!(await looksLikeTokenList(el, options))) return false;

  const listbox = await getListbox(el, options);
  const input = await getTextInput(el);
  if (!listbox || !input) return false;

  await clearExistingTokens(listbox, input, options);

  for (const item of values) {
    await input.fill(item, options);
    await input.press('Enter', options);
  }

  return true;
}
