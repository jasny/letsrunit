import { describe, expect, it } from 'vitest';
import { getLang } from '../../src/utils/get-lang';

describe('getLang', () => {
  it('returns null when no language is detected', async () => {
    const res = await getLang({ html: '<html />', url: 'https://example.com' } as any);
    expect(res).toBeNull();
  });

  it('handles page-like input with url() and content()', async () => {
    const res = await getLang({
      content: async () => '<html lang="en-US"></html>',
      url: () => 'https://example.com',
    } as any);

    expect(res).toEqual({ code: 'en', name: 'English' });
  });

  it('reads locale metadata when html lang is missing', async () => {
    const res = await getLang({
      html: '<html><head><meta property="og:locale" content="nl_NL" /></head></html>',
      url: 'https://example.com',
    } as any);

    expect(res).toEqual({ code: 'nl', name: 'Dutch' });
  });

  it('falls back to language code when ISO name is unknown', async () => {
    const res = await getLang({ html: '<html lang="zz-ZZ"></html>', url: 'https://example.com' } as any);
    expect(res).toEqual({ code: 'zz', name: 'zz' });
  });
});
