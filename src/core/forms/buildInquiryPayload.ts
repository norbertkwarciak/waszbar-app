import type { InquiryPayload } from '@/core/mutations/useSubmitInquiry';
import type { FormValues } from './useInquiryForm';
import type { SelectedExtraService } from '@/core/utils/helpers/pricing';

type BuildInquiryPayloadOptions = {
  values: FormValues;
  travelCost: number | null;
  travelLocationName: string | null;
  packagePrice: number;
  selectedExtraServices: SelectedExtraService[];
  isIndividualOffer: boolean;
};

export const buildInquiryPayload = ({
  values,
  travelCost,
  travelLocationName,
  packagePrice,
  selectedExtraServices,
  isIndividualOffer,
}: BuildInquiryPayloadOptions): InquiryPayload => {
  const resolvedTravelCost = travelCost ?? 0;
  const outdoorTentPrice = values.outdoorTent?.price ?? 0;
  const totalCost =
    packagePrice +
    resolvedTravelCost +
    selectedExtraServices.reduce((sum, service) => sum + service.price, 0) +
    outdoorTentPrice;

  return {
    date: values.date ?? '',
    fullName: values.fullName,
    email: values.email,
    phone: values.phone,
    numberOfGuests: Number(values.numberOfGuests),
    venueLocation: `${values.postalCode.trim()} ${values.city.trim()}`,
    foundLocation: travelLocationName ?? undefined,
    selectedPackage: values.selectedPackage?.value ?? '',
    selectedBar: values.selectedBar?.value ?? null,
    selectedServices: selectedExtraServices.map((service) => service.formattedLabel),
    notes: values.notes,
    isIndividualOffer,
    turnstileToken: values.captchaToken,
    packagePrice,
    travelCost: resolvedTravelCost,
    totalCost,
    selectedServicesObjects: selectedExtraServices.map((service) => ({
      id: service.id,
      label: service.formattedLabel,
      price: service.price,
      description: service.description,
    })),
    honeypot: values.hpCompany,
  };
};
