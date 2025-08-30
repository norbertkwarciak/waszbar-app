import type { ApiMenuPackage, MenuPackageType } from '@/types';

export const pickAvailableOrMaxRange = (target: number, avail: number[]): number => {
  const filtered = avail.filter((value) => value <= target);
  return filtered.length > 0 ? Math.max(...filtered) : Math.min(...avail);
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
