import { useMemo } from 'react';
import {
  buildAvailableRanges,
  buildSelectedExtraServices,
  getPackagePrice,
} from '@/core/utils/helpers';
import type { BarOption } from '@/core/config/options';
import type { OfferResponse } from '@/core/queries/useOffer';
import type { SelectedExtraService } from '@/core/utils/helpers/pricing';
import type { ExtraService, MenuPackage, MenuPackageType, SelectedService } from '@/types';

type UseOfferPricingOptions = {
  offer: OfferResponse | undefined;
  selectedPackage: MenuPackage | null;
  numberOfGuests: number | '';
  selectedServices: SelectedService[];
  outdoorTent: BarOption | null;
};

type OfferPricingResult = {
  extraServices: ExtraService[];
  rangesMap: Record<MenuPackageType, number[]> | null;
  selectedExtraServiceObjects: SelectedExtraService[];
  currentPackagePrice: number | null;
  isIndividualOffer: boolean;
  selectedExtraServices: Array<{ key: string; label: string; price: number }>;
  outdoorTentPrice: number | null;
};

export const useOfferPricing = ({
  offer,
  selectedPackage,
  numberOfGuests,
  selectedServices,
  outdoorTent,
}: UseOfferPricingOptions): OfferPricingResult => {
  const extraServices = offer?.extraServices ?? [];

  const rangesMap = useMemo(
    () => (offer ? buildAvailableRanges(offer.menuPackages) : null),
    [offer],
  );

  const selectedExtraServiceObjects = useMemo(
    () => buildSelectedExtraServices(extraServices, selectedServices),
    [extraServices, selectedServices],
  );

  const currentPackagePrice = useMemo(
    () =>
      selectedPackage
        ? getPackagePrice(offer?.menuPackages ?? [], selectedPackage.value, Number(numberOfGuests))
        : null,
    [selectedPackage, offer?.menuPackages, numberOfGuests],
  );

  const isIndividualOffer = useMemo(() => {
    if (!selectedPackage || !rangesMap) {
      return false;
    }

    const availableRanges = rangesMap[selectedPackage.value];
    if (!availableRanges?.length) {
      return false;
    }

    return Number(numberOfGuests) > Math.max(...availableRanges);
  }, [selectedPackage, rangesMap, numberOfGuests]);

  const selectedExtraServices = useMemo(
    () =>
      selectedExtraServiceObjects.map((service) => ({
        key: service.id,
        label: service.formattedLabel,
        price: service.price,
      })),
    [selectedExtraServiceObjects],
  );

  const outdoorTentPrice =
    typeof outdoorTent?.price === 'number' && outdoorTent.price > 0 ? outdoorTent.price : null;

  return {
    extraServices,
    rangesMap,
    selectedExtraServiceObjects,
    currentPackagePrice,
    isIndividualOffer,
    selectedExtraServices,
    outdoorTentPrice,
  };
};
