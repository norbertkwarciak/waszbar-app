import { useQuery } from '@tanstack/react-query';
import { env } from '@/core/config/env';
import type { ExtraService } from '@/types';
import type { ApiMenuPackage } from '@/types';

export type OfferResponse = {
  menuPackagesByYear: Record<OfferYear, ApiMenuPackage[]>;
  extraServices: ExtraService[];
};

type RawOffer = {
  menuPackagesByYear?: unknown;
  menuPackages?: unknown;
  extraServices: unknown;
};

export type OfferYear = 2026 | 2027 | 2028;
const OFFER_YEARS: OfferYear[] = [2026, 2027, 2028];

// Type guard for price object inside MenuPackage
const isPriceEntry = (entry: unknown): entry is { people: number; price: number } => {
  return (
    typeof entry === 'object' &&
    entry !== null &&
    'people' in entry &&
    typeof (entry as Record<string, unknown>).people === 'number' &&
    'price' in entry &&
    typeof (entry as Record<string, unknown>).price === 'number'
  );
};

// Type guard for MenuPackage
const isMenuPackage = (pkg: unknown): pkg is ApiMenuPackage => {
  if (
    typeof pkg !== 'object' ||
    pkg === null ||
    !('name' in pkg) ||
    typeof (pkg as Record<string, unknown>).name !== 'string' ||
    !('prices' in pkg) ||
    !Array.isArray((pkg as Record<string, unknown>).prices)
  ) {
    return false;
  }

  const prices = (pkg as Record<string, unknown>).prices;
  if (!Array.isArray(prices)) return false;
  return (prices as unknown[]).every(isPriceEntry);
};

// Type guard for ExtraService
const isExtraService = (s: unknown): s is ExtraService => {
  return (
    typeof s === 'object' &&
    s !== null &&
    'id' in s &&
    typeof (s as Record<string, unknown>).id === 'string' &&
    'label' in s &&
    typeof (s as Record<string, unknown>).label === 'string' &&
    'price' in s &&
    typeof (s as Record<string, unknown>).price === 'number' &&
    'description' in s &&
    typeof (s as Record<string, unknown>).description === 'string'
  );
};

const fetchOffer = async (): Promise<OfferResponse> => {
  const res = await fetch(env.api.getOffer);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const raw: unknown = await res.json();

  if (typeof raw !== 'object' || raw === null || !('extraServices' in raw)) {
    return {
      menuPackagesByYear: { 2026: [], 2027: [], 2028: [] },
      extraServices: [],
    };
  }

  const { menuPackagesByYear, menuPackages, extraServices } = raw as RawOffer;
  const yearlyData =
    typeof menuPackagesByYear === 'object' && menuPackagesByYear !== null
      ? (menuPackagesByYear as Record<string, unknown>)
      : null;
  const legacyPackages = Array.isArray(menuPackages) ? menuPackages.filter(isMenuPackage) : [];

  return {
    menuPackagesByYear: Object.fromEntries(
      OFFER_YEARS.map((year) => {
        const yearPackages = yearlyData?.[String(year)];
        const packages = Array.isArray(yearPackages)
          ? yearPackages.filter(isMenuPackage)
          : legacyPackages;
        return [year, packages];
      }),
    ) as Record<OfferYear, ApiMenuPackage[]>,
    extraServices: Array.isArray(extraServices) ? extraServices.filter(isExtraService) : [],
  };
};

export const useOffer = (): ReturnType<typeof useQuery<OfferResponse>> => {
  return useQuery<OfferResponse>({
    queryKey: ['offer'],
    queryFn: fetchOffer,
    staleTime: 1000 * 60 * 1,
    refetchOnWindowFocus: false,
  });
};
