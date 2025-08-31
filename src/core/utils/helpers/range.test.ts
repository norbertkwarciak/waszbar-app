import { describe, it, expect } from 'vitest';
import { buildAvailableRanges, pickAvailableOrMaxRange } from './range';

const mockMenuPackages = [
  {
    name: 'BASIC',
    prices: [
      { people: 50, price: 3400 },
      { people: 100, price: 3550 },
      { people: 120, price: 3750 },
      { people: 130, price: 4000 },
      { people: 150, price: 4050 },
      { people: 180, price: 4100 },
      { people: 200, price: 4200 },
      { people: 250, price: 4600 },
      { people: 300, price: 5100 },
      { people: 350, price: 5350 },
      { people: 400, price: 6150 },
    ],
  },
  {
    name: 'MEDIUM',
    prices: [
      { people: 50, price: 3850 },
      { people: 100, price: 4050 },
      { people: 120, price: 4150 },
      { people: 130, price: 4200 },
      { people: 150, price: 4250 },
      { people: 180, price: 4500 },
      { people: 200, price: 4650 },
      { people: 250, price: 5100 },
      { people: 300, price: 5650 },
      { people: 350, price: 6150 },
      { people: 400, price: 6700 },
    ],
  },
  {
    name: 'MAX',
    prices: [
      { people: 50, price: 4200 },
      { people: 100, price: 4550 },
      { people: 120, price: 4650 },
      { people: 130, price: 4700 },
      { people: 150, price: 4750 },
      { people: 180, price: 4950 },
      { people: 200, price: 5050 },
      { people: 250, price: 5650 },
      { people: 300, price: 6050 },
      { people: 350, price: 6600 },
      { people: 400, price: 7550 },
    ],
  },
  {
    name: 'EXCELLENT',
    prices: [
      { people: 50, price: 6200 },
      { people: 100, price: 6600 },
      { people: 120, price: 6800 },
      { people: 150, price: 7000 },
      { people: 180, price: 7400 },
      { people: 200, price: 7800 },
    ],
  },
  {
    name: 'KLASYCZNY',
    prices: [
      { people: 50, price: 4000 },
      { people: 100, price: 4600 },
      { people: 120, price: 4750 },
      { people: 150, price: 4950 },
      { people: 180, price: 5100 },
      { people: 200, price: 5300 },
      { people: 250, price: 6000 },
      { people: 300, price: 6350 },
    ],
  },
];

const PACKAGE_AVAILABLE_RANGES = buildAvailableRanges(mockMenuPackages);

describe('pickAvailableOrMaxRange with dynamic PACKAGE_AVAILABLE_RANGES', () => {
  it('returns exact match if available (basic - 180)', () => {
    const result = pickAvailableOrMaxRange(180, PACKAGE_AVAILABLE_RANGES.basic);
    expect(result).toBe(180);
  });

  it('returns closest higher (medium - 190 → 200)', () => {
    const result = pickAvailableOrMaxRange(190, PACKAGE_AVAILABLE_RANGES.medium);
    expect(result).toBe(200);
  });

  it('returns exact match (max - 300)', () => {
    const result = pickAvailableOrMaxRange(300, PACKAGE_AVAILABLE_RANGES.max);
    expect(result).toBe(300);
  });

  it('returns max range if guest count exceeds all (klasyczny - 400 → 300)', () => {
    const result = pickAvailableOrMaxRange(400, PACKAGE_AVAILABLE_RANGES.klasyczny);
    expect(result).toBe(300);
  });

  it('returns exact match (excellent - 150)', () => {
    const result = pickAvailableOrMaxRange(150, PACKAGE_AVAILABLE_RANGES.excellent);
    expect(result).toBe(150);
  });

  it('returns lowest available value when target is too low (excellent - 40 → 50)', () => {
    const result = pickAvailableOrMaxRange(40, PACKAGE_AVAILABLE_RANGES.excellent);
    expect(result).toBe(50);
  });

  it('returns max available value when target exceeds all (excellent - 400 → 200)', () => {
    const result = pickAvailableOrMaxRange(400, PACKAGE_AVAILABLE_RANGES.excellent);
    expect(result).toBe(200);
  });

  it('returns next higher range (basic - 140 → 150)', () => {
    const result = pickAvailableOrMaxRange(140, PACKAGE_AVAILABLE_RANGES.basic);
    expect(result).toBe(150);
  });

  it('returns next higher range (max - 190 → 200)', () => {
    const result = pickAvailableOrMaxRange(190, PACKAGE_AVAILABLE_RANGES.max);
    expect(result).toBe(200);
  });

  it('returns next higher range (klasyczny - 121 → 150)', () => {
    const result = pickAvailableOrMaxRange(121, PACKAGE_AVAILABLE_RANGES.klasyczny);
    expect(result).toBe(150);
  });
});
