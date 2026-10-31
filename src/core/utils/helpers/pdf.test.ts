import { describe, it, expect, vi } from 'vitest';
import { buildPdfFileName, getPdfUrl } from '.';
import { MenuPackageType } from '@/types';

vi.mock('@/core/config/env', () => ({
  env: {
    public: {
      pdfs: '/pdfs/',
    },
  },
}));

describe('getPdfUrl', () => {
  it('returns a valid encoded URL with + instead of %20', () => {
    const fileName = 'Waszbar.pl oferta MEDIUM do 150 gości.pdf';

    const result = getPdfUrl(fileName);

    expect(result).toEqual('/pdfs/Waszbar.pl_oferta_MEDIUM_do_150_gosci.pdf');
  });

  it('removes trailing slashes from base URL', async () => {
    vi.resetModules();
    vi.doMock('@/core/config/env', () => ({
      env: {
        public: {
          pdfs: '/pdfs/',
        },
      },
    }));
    const { getPdfUrl: getPdfUrlWithTrailing } = await import('.');

    const result = getPdfUrlWithTrailing('Waszbar.pl oferta CLASSIC do 100 gości.pdf');
    expect(result).toEqual('/pdfs/Waszbar.pl_oferta_CLASSIC_do_100_gosci.pdf');
  });

  it('returns null if base URL is empty', async () => {
    vi.resetModules();
    vi.doMock('@/core/config/env', () => ({
      env: {
        public: {
          pdfs: '',
        },
      },
    }));
    const { getPdfUrl: getPdfUrlEmpty } = await import('.');

    const result = getPdfUrlEmpty('somefile.pdf');
    expect(result).toBeNull();
  });
});

describe('buildPdfFileName', () => {
  it('keeps the legacy filename for 2026 offers', () => {
    expect(buildPdfFileName(MenuPackageType.BASIC, 50, 2026)).toBe(
      'Waszbar.pl_oferta_BASIC_do_50_gosci.pdf',
    );
  });

  it('uses the 2027 prefix and year in the filename', () => {
    expect(buildPdfFileName(MenuPackageType.BASIC, 100, 2027)).toBe(
      '2027_Waszbar.pl_oferta_BASIC_do_100_gosci.pdf',
    );
  });

  it('uses the 2028 offer for 2028 and later dates', () => {
    expect(buildPdfFileName(MenuPackageType.KLASYCZNY, 150, 2028)).toBe(
      '2028_Waszbar.pl_oferta_KLASYCZNA_do_150_gosci.pdf',
    );
    expect(buildPdfFileName(MenuPackageType.KLASYCZNY, 150, 2030)).toBe(
      '2028_Waszbar.pl_oferta_KLASYCZNA_do_150_gosci.pdf',
    );
  });

  it('keeps the legacy filename for packages without yearly PDFs', () => {
    expect(buildPdfFileName(MenuPackageType.DEGUSTACYJNY, 50, 2027)).toBe(
      'Waszbar.pl_oferta_DEGUSTACYJNY_do_50_gosci.pdf',
    );
  });
});
