import { describe, expect, it } from 'vitest';
import { MenuPackageType } from '@/types';
import { buildPdfFileName } from './pdf';
import { getOfferYear, getPackagePrice } from './pricing';
import { buildAvailableRanges, pickAvailableOrMaxRange } from './range';

const yearlyPackages = {
  2026: [
    {
      name: 'KLASYCZNY',
      prices: [
        { people: 50, price: 4000 },
        { people: 100, price: 4600 },
        { people: 120, price: 4750 },
        { people: 150, price: 4950 },
        { people: 200, price: 5300 },
      ],
    },
    {
      name: 'DEGUSTACYJNY',
      prices: [
        { people: 120, price: 6600 },
        { people: 200, price: 7600 },
      ],
    },
  ],
  2027: [
    {
      name: 'KLASYCZNY',
      prices: [
        { people: 50, price: 4250 },
        { people: 100, price: 4750 },
        { people: 120, price: 4950 },
        { people: 130, price: 5050 },
        { people: 150, price: 5200 },
        { people: 180, price: 5350 },
        { people: 200, price: 5600 },
      ],
    },
    {
      name: 'DEGUSTACYJNY',
      prices: [
        { people: 120, price: 6600 },
        { people: 200, price: 7600 },
      ],
    },
  ],
  2028: [
    {
      name: 'KLASYCZNY',
      prices: [
        { people: 50, price: 4500 },
        { people: 100, price: 5000 },
        { people: 120, price: 5250 },
        { people: 130, price: 5250 },
        { people: 150, price: 5550 },
        { people: 180, price: 5750 },
        { people: 200, price: 5950 },
      ],
    },
    {
      name: 'DEGUSTACYJNY',
      prices: [
        { people: 120, price: 6600 },
        { people: 200, price: 7600 },
      ],
    },
  ],
};

describe('getOfferYear', () => {
  it('selects the matching price year and caps future dates at 2028', () => {
    expect(getOfferYear('2026-12-31')).toBe(2026);
    expect(getOfferYear('2027-01-01')).toBe(2027);
    expect(getOfferYear('2028-01-01')).toBe(2028);
    expect(getOfferYear('2030-05-20')).toBe(2028);
    expect(getOfferYear(null)).toBe(2026);
  });
});

describe('year-based package prices and PDF tiers', () => {
  it('uses each year’s price and matching guest tier for the selected date', () => {
    const result = ([2026, 2027, 2028] as const).map((year) => {
      const packages = yearlyPackages[year];
      const ranges = buildAvailableRanges(packages);
      const tier = pickAvailableOrMaxRange(130, ranges.klasyczny);

      return {
        tier,
        price: getPackagePrice(packages, MenuPackageType.KLASYCZNY, 130),
        pdf: buildPdfFileName(MenuPackageType.KLASYCZNY, tier, year),
      };
    });

    expect(result).toEqual([
      {
        tier: 150,
        price: 4950,
        pdf: 'Waszbar.pl_oferta_KLASYCZNA_do_150_gosci.pdf',
      },
      {
        tier: 130,
        price: 5050,
        pdf: '2027_Waszbar.pl_oferta_KLASYCZNA_do_130_gosci.pdf',
      },
      {
        tier: 130,
        price: 5250,
        pdf: '2028_Waszbar.pl_oferta_KLASYCZNA_do_130_gosci.pdf',
      },
    ]);
  });

  it('keeps tasting package prices unchanged in each annual sheet', () => {
    const prices = ([2026, 2027, 2028] as const).map((year) =>
      getPackagePrice(yearlyPackages[year], MenuPackageType.DEGUSTACYJNY, 150),
    );

    expect(prices).toEqual([7600, 7600, 7600]);
  });
});
