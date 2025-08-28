import { describe, it, expect, vi } from 'vitest';
import { getPdfUrl } from '.';

vi.mock('@/config/env', () => ({
  env: {
    s3Url: 'https://bucket.s3.region.amazonaws.com/pdfs/',
  },
}));

describe('getPdfUrl', () => {
  it('returns a valid encoded URL with + instead of %20', () => {
    const fileName = 'Waszbar.pl oferta MEDIUM do 150 gości.pdf';

    const result = getPdfUrl(fileName);

    // Use the actual normalized and encoded output
    expect(result).toEqual(
      'https://bucket.s3.region.amazonaws.com/pdfs/Waszbar.pl+oferta+MEDIUM+do+150+gos%CC%81ci.pdf',
    );
  });

  it('removes trailing slashes from base URL', async () => {
    vi.resetModules();
    vi.doMock('@/config/env', () => ({
      env: {
        s3Url: 'https://bucket.s3.region.amazonaws.com/pdfs///',
      },
    }));
    const { getPdfUrl: getPdfUrlWithTrailing } = await import('.');

    const result = getPdfUrlWithTrailing('Waszbar.pl oferta CLASSIC do 100 gości.pdf');
    expect(result).toEqual(
      'https://bucket.s3.region.amazonaws.com/pdfs/Waszbar.pl+oferta+CLASSIC+do+100+gos%CC%81ci.pdf',
    );
  });

  it('returns null if base URL is empty', async () => {
    vi.resetModules();
    vi.doMock('@/config/env', () => ({
      env: {
        s3Url: '',
      },
    }));
    const { getPdfUrl: getPdfUrlEmpty } = await import('.');

    const result = getPdfUrlEmpty('somefile.pdf');
    expect(result).toBeNull();
  });
});
