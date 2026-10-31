import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSubmitInquiry } from '@/core/mutations/useSubmitInquiry';
import { Container, Space, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { menuPackages } from '@/core/config/options';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { FORM_PAGE_TRANSLATIONS } from '@/i18n/tKeys';
import { useAvailability } from '@/core/queries/useAvailability';
import { useOffer } from '@/core/queries/useOffer';
import MenuPackageModal from '@/components/MenuPackageModal';
import { env } from '@/core/config/env';
import {
  buildPdfFileName,
  getOfferYear,
  getPdfUrl,
  pickAvailableOrMaxRange,
} from '@/core/utils/helpers';
import PageHeader from '@/components/PageHeader';
import PriceSummaryBar from '@/components/PriceSummaryBar';
import DateAndBarSection from '@/components/form/DateAndBarSection';
import LocationAndGuestsSection from '@/components/form/LocationAndGuestsSection';
import PackageAndServicesSection from '@/components/form/PackageAndServicesSection';
import ContactDetailsSection from '@/components/form/ContactDetailsSection';
import SubmitValidationMessage from '@/components/form/SubmitValidationMessage';
import '@mantine/dates/styles.css';
import { INQUIRY_FIELD_ORDER, useInquiryForm } from '@/core/forms/useInquiryForm';
import { buildInquiryPayload } from '@/core/forms/buildInquiryPayload';
import { useOfferPricing } from '@/core/forms/useOfferPricing';

const FormPage = (): React.JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isMobile = useMediaQuery('(max-width: 768px)');

  const fieldLabels: Record<string, string> = {
    date: t(FORM_PAGE_TRANSLATIONS.checkDateLabel),
    selectedBar: t(FORM_PAGE_TRANSLATIONS.fieldValidationMessageLabel.selectedBar),
    postalCode: t(FORM_PAGE_TRANSLATIONS.fieldValidationMessageLabel.postalCode),
    city: t(FORM_PAGE_TRANSLATIONS.fieldValidationMessageLabel.city),
    numberOfGuests: t(FORM_PAGE_TRANSLATIONS.fieldValidationMessageLabel.numberOfGuests),
    selectedPackage: t(FORM_PAGE_TRANSLATIONS.fieldValidationMessageLabel.selectedPackage),
    fullName: t(FORM_PAGE_TRANSLATIONS.fieldValidationMessageLabel.fullName),
    email: t(FORM_PAGE_TRANSLATIONS.fieldValidationMessageLabel.email),
    phone: t(FORM_PAGE_TRANSLATIONS.fieldValidationMessageLabel.phone),
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const dateFromUrl = searchParams.get('date');
  const minSelectableDate = dayjs().add(7, 'day').startOf('day').toDate();

  const today = dayjs();
  const minSelectableDay = dayjs(minSelectableDate);
  const defaultCalendarMonth =
    minSelectableDay.month() !== today.month() || minSelectableDay.year() !== today.year()
      ? minSelectableDay.startOf('month').toDate()
      : undefined;

  const { data, isLoading: availabilityLoading, error: availabilityError } = useAvailability();
  const { data: offerData, isLoading: offerLoading, error: offerError } = useOffer();

  const takenDates = data?.takenDates ?? [];
  const lastCheckedDate = data?.lastCheckedDate ?? null;
  const lastCheckedDateObj = lastCheckedDate ? dayjs(lastCheckedDate, 'YYYY-M-D').toDate() : null;

  const form = useInquiryForm(dateFromUrl || null);

  const {
    date: dateString,
    postalCode,
    city,
    numberOfGuests,
    selectedBar,
    outdoorTent,
    selectedPackage,
    selectedServices,
  } = form.values;

  const {
    extraServices,
    rangesMap,
    selectedExtraServiceObjects,
    currentPackagePrice,
    isIndividualOffer,
    selectedExtraServices,
    outdoorTentPrice,
  } = useOfferPricing({
    offer: offerData,
    date: dateString,
    selectedPackage,
    numberOfGuests,
    selectedServices,
    outdoorTent,
  });

  const [travelCost, setTravelCost] = useState<number | null>(null);
  const [travelLoading, setTravelLoading] = useState<boolean>(false);
  const [travelError, setTravelError] = useState<string | null>(null);
  const [travelLocationName, setTravelLocationName] = useState<string | null>(null);
  const travelRequestController = useRef<AbortController | null>(null);

  const [exceedsMaxRange, setExceedsMaxRange] = useState<number | null>(null);
  const [modalPackage, setModalPackage] = useState<null | (typeof menuPackages)[0]>(null);
  const [packagePdfUrl, setPackagePdfUrl] = useState<string | null>(null);

  const normalizedDate = dateString ? dayjs(dateString).format('YYYY-M-D') : null;
  const dateStatus: 'available' | 'unavailable' | null = !dateString
    ? null
    : takenDates?.includes(normalizedDate ?? '')
      ? 'unavailable'
      : 'available';

  useEffect(() => {
    if (availabilityError || offerError) {
      showNotification({
        title: t(FORM_PAGE_TRANSLATIONS.dataFetchErrorTitle),
        message: t(FORM_PAGE_TRANSLATIONS.dataFetchErrorMsg),
        color: 'red',
        icon: <IconX size={18} />,
      });
    }
  }, [availabilityError, offerError, t]);

  useEffect(() => {
    travelRequestController.current?.abort();
    travelRequestController.current = null;

    setTravelCost(null);
    setTravelLoading(false);
    setTravelLocationName(null);
    setTravelError(null);

    return () => {
      travelRequestController.current?.abort();
    };
  }, [postalCode, city]);

  const handleDateChange = (value: string | null): void => {
    form.setFieldValue('date', value);

    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set('date', value);
    else newParams.delete('date');

    setSearchParams(newParams);
  };

  const handleFetchTravelCost = async (): Promise<void> => {
    travelRequestController.current?.abort();
    travelRequestController.current = null;

    setTravelLoading(true);
    setTravelError(null);
    setTravelCost(null);
    setTravelLocationName(null);

    const postalErr = form.validateField('postalCode').error;
    const cityErr = form.validateField('city').error;

    if (postalErr || cityErr) {
      setTravelLoading(false);

      return;
    }

    const controller = new AbortController();
    travelRequestController.current = controller;

    try {
      const response = await fetch(env.api.calculateTravelCost, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postalCode, city }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.code === 'OUT_OF_COUNTRY') {
          throw new Error(t(FORM_PAGE_TRANSLATIONS.locationOutsidePolandError));
        }
        throw new Error(t(FORM_PAGE_TRANSLATIONS.dataTravelCostFetchErrorMsg));
      }

      const result = await response.json();
      setTravelCost(result.cost ?? 0);
      setTravelLocationName(result.location?.displayName ?? null);
    } catch (error: unknown) {
      if (!controller.signal.aborted) {
        const message = error instanceof Error ? error.message : 'Wystąpił błąd';
        setTravelError(message);
      }
    } finally {
      if (travelRequestController.current === controller) {
        travelRequestController.current = null;
        setTravelLoading(false);
      }
    }
  };

  const toggleServiceSelection = (id: string, count?: number): void => {
    if (count !== undefined) {
      const filtered = selectedServices.filter((s) => s.id !== id);
      form.setFieldValue('selectedServices', count > 0 ? [...filtered, { id, count }] : filtered);
    } else {
      const exists = selectedServices.some((s) => s.id === id);
      form.setFieldValue(
        'selectedServices',
        exists
          ? selectedServices.filter((s) => s.id !== id)
          : [...selectedServices, { id, count: 1 }],
      );
    }
  };

  const resetForm = (): void => {
    travelRequestController.current?.abort();
    travelRequestController.current = null;

    form.reset();
    setTravelCost(null);
    setTravelError(null);
    setTravelLoading(false);
    setModalPackage(null);
    setPackagePdfUrl(null);
    setExceedsMaxRange(null);
    setSearchParams(new URLSearchParams());
  };

  const { mutate: submitInquiry, isPending: isSubmitting } = useSubmitInquiry();

  const handleSubmit = async (): Promise<void> => {
    const { errors } = form.validate();
    const { captchaToken } = form.values;

    if (travelCost === null) {
      setTravelError(t(FORM_PAGE_TRANSLATIONS.travelCostRequiredError));
    }

    const isMissing = (key: (typeof INQUIRY_FIELD_ORDER)[number]): boolean => {
      if (key === 'travelCost') {
        return travelCost === null;
      }

      if (key === 'captcha') {
        return !captchaToken;
      }

      return key in errors;
    };

    const labelFor = (key: (typeof INQUIRY_FIELD_ORDER)[number]): string => {
      if (key === 'travelCost') {
        return t(FORM_PAGE_TRANSLATIONS.fieldValidationMessageLabel.travelCost);
      }

      if (key === 'captcha') {
        return t(FORM_PAGE_TRANSLATIONS.fieldValidationMessageLabel.captcha);
      }

      return fieldLabels[key] || key;
    };

    const missingLabels = INQUIRY_FIELD_ORDER.filter(isMissing).map(labelFor);

    if (missingLabels.length > 0) {
      showNotification({
        title: t(FORM_PAGE_TRANSLATIONS.submitErrorTitle),
        message: (
          <SubmitValidationMessage
            message={t(FORM_PAGE_TRANSLATIONS.submitErrorMsg)}
            missingLabels={missingLabels}
          />
        ),
        color: 'red',
        icon: <IconX size={18} />,
        autoClose: false,
      });

      return;
    }

    submitInquiry(
      buildInquiryPayload({
        values: form.values,
        travelCost,
        travelLocationName,
        packagePrice: currentPackagePrice ?? 0,
        selectedExtraServices: selectedExtraServiceObjects,
        isIndividualOffer,
      }),
      {
        onSuccess: () => {
          showNotification({
            title: t(FORM_PAGE_TRANSLATIONS.submitSuccessTitle),
            message: t(FORM_PAGE_TRANSLATIONS.submitSuccessMsg),
            color: 'green',
            icon: <IconCheck size={18} />,
          });

          navigate('/');
          resetForm();
        },
        onError: (error: Error) => {
          showNotification({
            title: t(FORM_PAGE_TRANSLATIONS.submitErrorTitle),
            message: error.message,
            color: 'red',
            icon: <IconX size={18} />,
          });
        },
      },
    );
  };

  const openPackageModal = (pkg: (typeof menuPackages)[0]): void => {
    setModalPackage(pkg);
    setExceedsMaxRange(null);

    if (numberOfGuests === '' || isNaN(Number(numberOfGuests))) {
      setPackagePdfUrl(null);
      return;
    }

    const availableRanges = rangesMap?.[pkg.value];
    if (!availableRanges?.length) {
      setPackagePdfUrl(null);
      return;
    }

    const maxRange = Math.max(...availableRanges);
    const guests = Number(numberOfGuests);

    if (guests > maxRange) {
      setExceedsMaxRange(maxRange);
      setPackagePdfUrl(null);

      return;
    }

    const resolvedRange = pickAvailableOrMaxRange(guests, availableRanges);

    const year = getOfferYear(dateString);
    const fileName = buildPdfFileName(pkg.value, resolvedRange, year);

    const url = getPdfUrl(fileName);

    setPackagePdfUrl(url ?? null);
  };

  const handleRemoveExtraService = (id: string): void => {
    form.setFieldValue(
      'selectedServices',
      selectedServices.filter((s) => s.id !== id),
    );
  };

  return (
    <Container
      size="md"
      style={{
        paddingTop: 20,
        paddingBottom: 60,
        paddingLeft: isMobile ? 0 : 16,
        paddingRight: isMobile ? 0 : 16,
      }}
    >
      <Space h={20} />
      <Stack gap="xl">
        <PageHeader title={t(FORM_PAGE_TRANSLATIONS.title)} />

        <DateAndBarSection
          date={dateString}
          dateStatus={dateStatus}
          isMobile={isMobile}
          isLoading={availabilityLoading && offerLoading}
          isDisabled={availabilityLoading || !!availabilityError || !!offerError}
          minDate={minSelectableDate}
          maxDate={lastCheckedDateObj ?? undefined}
          defaultDate={defaultCalendarMonth}
          selectedBar={selectedBar}
          outdoorTent={outdoorTent}
          onDateChange={handleDateChange}
          onSelectBar={(bar) => form.setFieldValue('selectedBar', bar)}
          onToggleOutdoorTent={(option) =>
            form.setFieldValue('outdoorTent', outdoorTent?.value === option.value ? null : option)
          }
        />

        {dateStatus === 'available' && (
          <>
            <LocationAndGuestsSection
              isMobile={isMobile}
              postalCode={postalCode}
              city={city}
              numberOfGuests={numberOfGuests}
              travelCost={travelCost}
              travelLoading={travelLoading}
              travelError={travelError}
              travelLocationName={travelLocationName}
              onPostalCodeChange={(value) => form.setFieldValue('postalCode', value)}
              onCityChange={(value) => form.setFieldValue('city', value)}
              onGuestsChange={(value) => form.setFieldValue('numberOfGuests', value)}
              onCalculateTravelCost={handleFetchTravelCost}
            />
            <PackageAndServicesSection
              extraServices={extraServices}
              selectedPackage={selectedPackage}
              selectedServices={selectedServices}
              isMobile={isMobile}
              onSelectPackage={(pkg) => form.setFieldValue('selectedPackage', pkg)}
              onOpenPackage={openPackageModal}
              onToggleService={toggleServiceSelection}
            />
            <ContactDetailsSection
              siteKey={env.turnstile.siteKey}
              notesProps={form.getInputProps('notes')}
              fullNameProps={form.getInputProps('fullName')}
              emailProps={form.getInputProps('email')}
              phoneProps={form.getInputProps('phone')}
              honeypotProps={form.getInputProps('hpCompany')}
              onCaptchaVerify={(token) => form.setFieldValue('captchaToken', token)}
            />
          </>
        )}
        <Space h={isMobile ? 220 : 110} />
      </Stack>

      <MenuPackageModal
        opened={!!modalPackage}
        onClose={() => {
          setModalPackage(null);
          setPackagePdfUrl(null);
          setExceedsMaxRange(null);
        }}
        modalPackage={modalPackage}
        numberOfGuests={numberOfGuests}
        rangesMap={rangesMap}
        packagePdfUrl={packagePdfUrl}
        exceedsMaxRange={exceedsMaxRange}
      />

      <PriceSummaryBar
        packageLabel={selectedPackage?.label ?? null}
        packagePrice={currentPackagePrice}
        extraServices={selectedExtraServices}
        travelCost={travelCost}
        outdoorTentLabel={outdoorTent?.label ?? null}
        outdoorTentPrice={outdoorTentPrice}
        isIndividualOffer={isIndividualOffer}
        onRemoveOutdoorTent={() => form.setFieldValue('outdoorTent', null)}
        onRemovePackage={() => form.setFieldValue('selectedPackage', null)}
        onRemoveExtraService={handleRemoveExtraService}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </Container>
  );
};

export default FormPage;
