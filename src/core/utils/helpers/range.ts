import type { ApiMenuPackage, MenuPackageType } from '@/types';

export const pickAvailableOrMaxRange = (target: number, avail: number[]): number => {
  const sorted = [...avail].sort((a, b) => a - b);

  for (const value of sorted) {
    if (value >= target) {
      return value;
    }
  }

  // If target exceeds all values, return the highest
  return sorted[sorted.length - 1];
};

export const buildAvailableRanges = (
  menuPackages: ApiMenuPackage[],
): Record<MenuPackageType, number[]> => {
  const result: Partial<Record<MenuPackageType, number[]>> = {};

  menuPackages.forEach((pkg) => {
    const key = pkg.name.toLowerCase() as MenuPackageType;
    const ranges = pkg.prices
      .map((p) => p.people)
      .filter((n): n is number => typeof n === 'number')
      .sort((a, b) => a - b);

    result[key] = ranges;
  });

  return result as Record<MenuPackageType, number[]>;
};
