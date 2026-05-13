import { JSDOM } from 'jsdom';
import type { PageInfo, Snapshot } from './types';

type ExtractPageInfoOptions = Pick<Snapshot, 'html' | 'url'> & Partial<Snapshot>;

function getContent(document: Document, selectors: string[]): string | undefined {
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    const value =
      element?.getAttribute('content') ||
      ('textContent' in (element || {}) ? element?.textContent : null) ||
      element?.getAttribute('href');

    if (value?.trim()) return value.trim();
  }
}

function resolveUrl(value: string | undefined, baseUrl: string): string | undefined {
  if (!value) return undefined;

  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return value;
  }
}

function getTitle(document: Document): string | undefined {
  const title = document.querySelector('title')?.textContent?.trim();
  if (title) return title;

  return getContent(document, [
    'meta[property="og:title"]',
    'meta[name="twitter:title"]',
    'meta[name="application-name"]',
  ]);
}

function getDescription(document: Document): string | undefined {
  return getContent(document, [
    'meta[name="description"]',
    'meta[property="og:description"]',
    'meta[name="twitter:description"]',
  ]);
}

function getImage(document: Document, baseUrl: string): string | undefined {
  return resolveUrl(
    getContent(document, ['meta[property="og:image"]', 'meta[name="twitter:image"]']),
    baseUrl,
  );
}

function getLang(document: Document): string | undefined {
  const htmlLang = document.documentElement.getAttribute('lang')?.trim();
  if (htmlLang) return htmlLang;

  return getContent(document, [
    'meta[property="og:locale"]',
    'meta[http-equiv="content-language"]',
    'meta[name="language"]',
  ]);
}

function getCanonicalUrl(document: Document, baseUrl: string): string | undefined {
  return resolveUrl(
    getContent(document, ['link[rel="canonical"]', 'meta[property="og:url"]']),
    baseUrl,
  );
}

function getFavicon(document: Document, baseUrl: string): string | undefined {
  const selectors = [
    'link[rel="icon"]',
    'link[rel="shortcut icon"]',
    'link[rel="apple-touch-icon"]',
    'link[rel~="icon"]',
  ];

  for (const selector of selectors) {
    const href = document.querySelector(selector)?.getAttribute('href')?.trim();
    if (href) return resolveUrl(href, baseUrl);
  }
}

export async function extractPageInfo(options: ExtractPageInfoOptions): Promise<PageInfo> {
  const dom = new JSDOM(options.html, { url: options.url });
  const { document } = dom.window;

  return {
    url: getCanonicalUrl(document, options.url) || options.url,
    name: getTitle(document),
    description: getDescription(document),
    image: getImage(document, options.url),
    favicon: getFavicon(document, options.url),
    lang: getLang(document),
    screenshot: options.screenshot,
  };
}
