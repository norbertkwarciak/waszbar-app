import { useQuery } from '@tanstack/react-query';
import { env } from '@/core/config/env';
import type { ExtraService } from '@/types';
import type { ApiMenuPackage } from '@/types';

export type OfferResponse = {
  menuPackages: ApiMenuPackage[];
  extraServices: ExtraService[];
};

type RawOffer = {
  menuPackages: unknown;
  extraServices: unknown;
};

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

  if (
    typeof raw !== 'object' ||
    raw === null ||
    !('menuPackages' in raw) ||
    !('extraServices' in raw)
  ) {
    return { menuPackages: [], extraServices: [] };
  }

  const { menuPackages, extraServices } = raw as RawOffer;

  return {
    menuPackages: Array.isArray(menuPackages) ? menuPackages.filter(isMenuPackage) : [],
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
