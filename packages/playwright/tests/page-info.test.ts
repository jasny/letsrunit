import { describe, expect, it } from 'vitest';
import { extractPageInfo } from '../src/page-info';

describe('extractPageInfo', () => {
  it('extracts metadata and resolves relative URLs', async () => {
    const info = await extractPageInfo({
      url: 'https://example.com/products/widget',
      html: `
        <html lang="en-US">
          <head>
            <title>Widget</title>
            <meta name="description" content="Product details" />
            <meta property="og:image" content="/images/widget.png" />
            <link rel="canonical" href="/products/widget-canonical" />
            <link rel="icon" href="/favicon.ico" />
          </head>
        </html>
      `,
    });

    expect(info).toEqual({
      url: 'https://example.com/products/widget-canonical',
      name: 'Widget',
      description: 'Product details',
      image: 'https://example.com/images/widget.png',
      favicon: 'https://example.com/favicon.ico',
      lang: 'en-US',
      screenshot: undefined,
    });
  });

  it('falls back to metadata tags when title and canonical are missing', async () => {
    const info = await extractPageInfo({
      url: 'https://example.com/post',
      html: `
        <html>
          <head>
            <meta property="og:title" content="Open Graph Title" />
            <meta name="twitter:description" content="Twitter summary" />
            <meta name="twitter:image" content="https://cdn.example.com/post.png" />
            <meta property="og:locale" content="fr_FR" />
            <meta property="og:url" content="https://www.example.com/post" />
            <link rel="apple-touch-icon" href="https://cdn.example.com/icon.png" />
          </head>
        </html>
      `,
    });

    expect(info).toEqual({
      url: 'https://www.example.com/post',
      name: 'Open Graph Title',
      description: 'Twitter summary',
      image: 'https://cdn.example.com/post.png',
      favicon: 'https://cdn.example.com/icon.png',
      lang: 'fr_FR',
      screenshot: undefined,
    });
  });
});
