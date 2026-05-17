import type { Locator } from '@playwright/test';
import { describe, expect, it, vi } from 'vitest';
import { setFieldValue } from '../../src/field/index';

function makeEmptyLocator() {
  const loc: any = {
    count: vi.fn().mockResolvedValue(0),
    check: vi.fn().mockResolvedValue(undefined),
    uncheck: vi.fn().mockResolvedValue(undefined),
    all: vi.fn().mockResolvedValue([]),
    nth: vi.fn().mockReturnThis(),
    first: vi.fn().mockReturnThis(),
    filter: vi.fn().mockReturnThis(),
    getAttribute: vi.fn().mockResolvedValue(null),
    textContent: vi.fn().mockResolvedValue(''),
    click: vi.fn().mockResolvedValue(undefined),
    isChecked: vi.fn().mockResolvedValue(false),
    scrollIntoViewIfNeeded: vi.fn().mockResolvedValue(undefined),
    boundingBox: vi.fn().mockResolvedValue(null),
    focus: vi.fn().mockResolvedValue(undefined),
  };
  loc.locator = vi.fn().mockReturnValue(loc);
  loc.getByRole = vi.fn().mockReturnValue(loc);
  return loc;
}

function makeMockEl(tag: string, type: string | null): Locator {
  const emptyLoc = makeEmptyLocator();
  const chipsInput: any = {
    count: vi.fn().mockResolvedValue(0),
    all: vi.fn().mockResolvedValue([]),
    first: vi.fn().mockReturnThis(),
    fill: vi.fn().mockResolvedValue(undefined),
    press: vi.fn().mockResolvedValue(undefined),
    focus: vi.fn().mockResolvedValue(undefined),
  };
  const chipsListbox: any = {
    count: vi.fn().mockResolvedValue(0),
    first: vi.fn().mockReturnThis(),
    locator: vi.fn().mockReturnValue({
      count: vi.fn().mockResolvedValue(0),
    }),
  };
  const fileInput: any = {
    count: vi.fn().mockResolvedValue(0),
    first: vi.fn().mockReturnThis(),
    setInputFiles: vi.fn().mockResolvedValue(undefined),
    fill: vi.fn().mockResolvedValue(undefined),
  };
  const el: any = {
    count: vi.fn().mockResolvedValue(1),
    evaluate: vi.fn().mockResolvedValue(tag),
    getAttribute: vi.fn().mockImplementation(async (attr: string) => {
      if (attr === 'type') return type;
      return null;
    }),
    fill: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn().mockResolvedValue(undefined),
    setInputFiles: vi.fn().mockResolvedValue(undefined),
    locator: vi.fn().mockImplementation((selector: string) => {
      if (selector === 'input[type="file"]') return fileInput;
      if (selector === '[role="listbox"]') return chipsListbox;
      if (selector === 'input[type="text"], input:not([type])') return chipsInput;
      return emptyLoc;
    }),
    getByRole: vi.fn().mockReturnValue(emptyLoc),
    getByLabel: vi.fn().mockReturnValue({ locator: vi.fn().mockReturnValue(emptyLoc) }),
    page: vi.fn().mockReturnValue({ locator: vi.fn().mockReturnValue(emptyLoc) }),
    __fileInput: fileInput,
    __chipsInput: chipsInput,
    __chipsListbox: chipsListbox,
  };
  return el as unknown as Locator;
}

describe('setFieldValue', () => {
  it('fills a text input via setNativeInput', async () => {
    const el = makeMockEl('input', 'text');
    await setFieldValue(el, 'hello');
    expect((el as any).fill).toHaveBeenCalledWith('hello', undefined);
  });

  it('uses setFallback (fill) when no handler matches (div tag)', async () => {
    const el = makeMockEl('div', null);
    await setFieldValue(el, 'hello');
    // setFallback calls el.fill with toString(value) = 'hello'
    expect((el as any).fill).toHaveBeenCalledWith('hello', undefined);
  });

  it('uses setFallback with array value, joining with newline', async () => {
    const el = makeMockEl('div', null);
    await setFieldValue(el, ['a', 'b', 'c']);
    expect((el as any).fill).toHaveBeenCalledWith('a\nb\nc', undefined);
  });

  it('uses setFallback with range value, formatting as "from - to"', async () => {
    const el = makeMockEl('div', null);
    await setFieldValue(el, { from: 1, to: 5 });
    expect((el as any).fill).toHaveBeenCalledWith('1 - 5', undefined);
  });

  it('uses setInputFiles for native file inputs', async () => {
    const el = makeMockEl('input', 'file');
    await setFieldValue(el, { kind: 'file', paths: ['avatar.png'] });
    expect((el as any).setInputFiles).toHaveBeenCalledWith('avatar.png', undefined);
  });

  it('uses setInputFiles with multiple files for native file inputs', async () => {
    const el = makeMockEl('input', 'file');
    await setFieldValue(el, { kind: 'file', paths: ['a.txt', 'b.txt'] });
    expect((el as any).setInputFiles).toHaveBeenCalledWith(['a.txt', 'b.txt'], undefined);
  });

  it('throws for file values on non-file inputs', async () => {
    const el = makeMockEl('input', 'text');
    await expect(setFieldValue(el, { kind: 'file', paths: ['avatar.png'] })).rejects.toThrow(
      'File values are only supported for input[type="file"]',
    );
  });

  it('throws for non-file values on file inputs', async () => {
    const el = makeMockEl('input', 'file');
    await expect(setFieldValue(el, 'avatar.png')).rejects.toThrow('File inputs only support file values');
  });

  it('uses a descendant file input when the locator points to a component root', async () => {
    const el = makeMockEl('div', null) as any;
    el.__fileInput.count.mockResolvedValue(1);
    await setFieldValue(el, { kind: 'file', paths: ['avatar.png'] });
    expect(el.__fileInput.setInputFiles).toHaveBeenCalledWith('avatar.png', undefined);
  });

  it('sets a composite chips control from a single string', async () => {
    const el = makeMockEl('div', null) as any;
    el.__chipsListbox.count.mockResolvedValue(1);
    el.__chipsInput.count.mockResolvedValue(1);

    await setFieldValue(el, 'hello');

    expect(el.__chipsInput.fill).toHaveBeenCalledWith('hello', undefined);
    expect(el.__chipsInput.press).toHaveBeenCalledWith('Enter', undefined);
  });

  it('sets a composite chips control from an array of strings', async () => {
    const el = makeMockEl('div', null) as any;
    el.__chipsListbox.count.mockResolvedValue(1);
    el.__chipsInput.count.mockResolvedValue(1);

    await setFieldValue(el, ['hello', 'world']);

    expect(el.__chipsInput.fill).toHaveBeenNthCalledWith(1, 'hello', undefined);
    expect(el.__chipsInput.fill).toHaveBeenNthCalledWith(2, 'world', undefined);
    expect(el.__chipsInput.press).toHaveBeenCalledTimes(2);
  });
});
