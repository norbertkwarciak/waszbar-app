import type { ApiMenuPackage, ExtraService, SelectedService } from '@/types';

export const getPackagePrice = (
  menuPackages: ApiMenuPackage[],
  selectedPackageValue: string,
  numberOfGuests: number,
): number => {
  const pkg = menuPackages.find((p) => p.name.toUpperCase() === selectedPackageValue.toUpperCase());
  if (!pkg) return 0;

  const sortedPrices = [...pkg.prices].sort((a, b) => a.people - b.people);
  const selected = sortedPrices.find((p) => numberOfGuests <= p.people) ?? sortedPrices.at(-1);

  return selected?.price ?? 0;
};

export type SelectedExtraService = ExtraService & { formattedLabel: string; count: number };

export const buildSelectedExtraServices = (
  catalog: ExtraService[],
  selected: SelectedService[],
): SelectedExtraService[] =>
  selected
    .map((sel) => {
      const entry = catalog.find((s) => s.id === sel.id);
      if (!entry) return null;
      return {
        ...entry,
        count: sel.count,
        price: entry.price * sel.count,
        formattedLabel: sel.count > 1 ? `${sel.count} x ${entry.label}` : entry.label,
      };
    })
    .filter((s): s is SelectedExtraService => s !== null);
