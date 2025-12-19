import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSubmitInquiry } from '@/core/mutations/useSubmitInquiry';
import Turnstile from 'react-turnstile';
import {
  Button,
  Container,
  Group,
  Loader,
  NumberInput,
  Paper,
  SimpleGrid,
  Space,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { DateInput } from '@mantine/dates';
import { IconCheck, IconX, IconCalendar } from '@tabler/icons-react';
import { showNotification } from '@mantine/notifications';
import { barOptions, menuPackages } from '@/core/config/options';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { COMMON, FORM_PAGE_TRANSLATIONS } from '@/i18n/tKeys';
import { buildPdfFileName, getPdfUrl } from '@/core/utils/helpers';
import ExtraServiceBox from '@/components/ExtraServiceBox';
import MenuPackageBox from '@/components/MenuPackageBox';
import BarOptionBox from '@/components/BarOptionBox';
import CenteredGrid from '@/components/CenteredGrid';
import { useAvailability } from '@/core/queries/useAvailability';
import { useOffer } from '@/core/queries/useOffer';
import MenuPackageModal from '@/components/MenuPackageModal';
import { env } from '@/core/config/env';
import { countDigits, pickAvailableOrMaxRange, buildAvailableRanges } from '@/core/utils/helpers';
import { regex } from '@/core/utils/regex';
import PageHeader from '@/components/PageHeader';
import PriceSummaryBar from '@/components/PriceSummaryBar';
import FormDivider from '@/components/FormDivider';
import type { MenuPackage } from '@/types';

const FormPage = (): React.JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isMobile = useMediaQuery('(max-width: 768px)');

  const fieldLabels: Record<string, string> = {
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

  const { data, isLoading: availabilityLoading, error: availabilityError } = useAvailability();
  const { data: offerData, isLoading: offerLoading, error: offerError } = useOffer();

  const extraServices = offerData?.extraServices ?? [];
  console.log('🚀 ~ FormPage ~ extraServices:', extraServices);
  const rangesMap = offerData ? buildAvailableRanges(offerData.menuPackages) : null;

  const takenDates = data?.takenDates ?? [];
  const lastCheckedDate = data?.lastCheckedDate ?? null;
  const lastCheckedDateObj = lastCheckedDate ? dayjs(lastCheckedDate, 'YYYY-M-D').toDate() : null;

  const [dateString, setDateString] = useState<string | null>(dateFromUrl || null);
  const [notes, setNotes] = useState<string>('');
  const [selectedBar, setSelectedBar] = useState<string | null>(null);

  const [travelCost, setTravelCost] = useState<number | null>(null);
  const [travelLoading, setTravelLoading] = useState<boolean>(false);
  const [travelError, setTravelError] = useState<string | null>(null);

  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [postalCodeError, setPostalCodeError] = useState<string | null>(null);
  const [cityError, setCityError] = useState<string | null>(null);

  const [numberOfGuests, setNumberOfGuests] = useState<number | ''>(100);
  const [exceedsMaxRange, setExceedsMaxRange] = useState<number | null>(null);

  const [selectedPackage, setSelectedPackage] = useState<MenuPackage | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [serviceCounts, setServiceCounts] = useState<Record<string, number>>({});
  const [modalPackage, setModalPackage] = useState<null | (typeof menuPackages)[0]>(null);
  const [packagePdfUrl, setPackagePdfUrl] = useState<string | null>(null);

  const [fullName, setFullName] = useState<string>('');
  const [fullNameError, setFullNameError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phone, setPhone] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [isIndividualOffer, setIsIndividualOffer] = useState(false);

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const normalizedDate = dateString ? dayjs(dateString).format('YYYY-M-D') : null;
  const dateStatus: 'available' | 'unavailable' | null = !dateString
    ? null
    : takenDates?.includes(normalizedDate ?? '')
      ? 'unavailable'
      : 'available';

  const validateEmail = (value: string): string | null => {
    const v = value.trim();

    if (!v) return t(FORM_PAGE_TRANSLATIONS.emailValidationRequired);
    if (!regex.email.test(v)) return t(FORM_PAGE_TRANSLATIONS.emailValidationInvalid);

    return null;
  };

  const validatePhone = (value: string): string | null => {
    const v = value.trim();

    if (!v) return t(FORM_PAGE_TRANSLATIONS.phoneValidationRequired);
    if (!regex.phone.test(v)) return t(FORM_PAGE_TRANSLATIONS.phoneValidationInvalid);

    const digits = countDigits(v);
    if (digits < 9 || digits > 15) return t(FORM_PAGE_TRANSLATIONS.phoneValidationLength);

    return null;
  };

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

  const handleDateChange = (value: string | null): void => {
    setDateString(value);

    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set('date', value);
    else newParams.delete('date');

    setSearchParams(newParams);
  };

  const handleBarSelect = (barType: string): void => {
    setSelectedBar(barType);
  };

  const handleFetchTravelCost = async (): Promise<void> => {
    setTravelLoading(true);
    setTravelError(null);
    setTravelCost(null);

    let hasValidationError = false;

    if (!postalCode.match(/^\d{2}-\d{3}$/)) {
      setPostalCodeError(t(FORM_PAGE_TRANSLATIONS.postalCodeInvalidError));
      hasValidationError = true;
    }

    if (!city.trim()) {
      setCityError(t(FORM_PAGE_TRANSLATIONS.cityRequiredError));
      hasValidationError = true;
    }

    if (hasValidationError) {
      setTravelLoading(false);
      return;
    }

    try {
      const response = await fetch(env.api.calculateTravelCost, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postalCode,
          city,
        }),
      });

      if (!response.ok) {
        throw new Error(t(FORM_PAGE_TRANSLATIONS.dataTravelCostFetchErrorMsg));
      }

      const data = await response.json();
      setTravelCost(data.cost ?? 0);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setTravelError(error.message || 'Wystąpił błąd');
    } finally {
      setTravelLoading(false);
    }
  };

  const handlePackageSelect = (pkg: MenuPackage | null): void => {
    setSelectedPackage(pkg);

    if (!pkg || !rangesMap) {
      setIsIndividualOffer(false);
      return;
    }

    const availableRanges = rangesMap[pkg.value];
    if (!availableRanges?.length) {
      setIsIndividualOffer(false);
      return;
    }

    const maxRange = Math.max(...availableRanges);
    const guests = Number(numberOfGuests);

    setIsIndividualOffer(guests > maxRange);
  };

  useEffect(() => {
    if (!selectedPackage || !rangesMap) {
      setIsIndividualOffer(false);
      return;
    }

    const availableRanges = rangesMap[selectedPackage.value];
    if (!availableRanges?.length) {
      setIsIndividualOffer(false);
      return;
    }

    const maxRange = Math.max(...availableRanges);
    const guests = Number(numberOfGuests);

    setIsIndividualOffer(guests > maxRange);
  }, [numberOfGuests, selectedPackage, rangesMap]);

  const toggleServiceSelection = (value: string, count?: number): void => {
    if (count !== undefined) {
      setServiceCounts((prevCounts) => ({ ...prevCounts, [value]: count }));

      setSelectedServices((prev) => {
        const filtered = prev.filter((v) => v !== value && !v.includes(` x ${value}`));

        if (count > 0) {
          return [...filtered, `${count} x ${value}`];
        } else {
          return filtered;
        }
      });
    } else {
      setSelectedServices((prev) => {
        const isCurrentlySelected = prev.includes(value);

        if (isCurrentlySelected) {
          return prev.filter((v) => v !== value);
        } else {
          return [...prev, value];
        }
      });
    }
  };

  const resetForm = (): void => {
    setDateString(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setNotes('');
    setPostalCode('');
    setCity('');
    setPostalCodeError(null);
    setCityError(null);
    setTravelCost(null);
    setTravelError(null);
    setTravelLoading(false);
    setNumberOfGuests(100);
    setSelectedBar(null);
    setSelectedPackage(null);
    setSelectedServices([]);
    setServiceCounts({});
    setModalPackage(null);
    setPackagePdfUrl(null);
    setExceedsMaxRange(null);
    setSearchParams(new URLSearchParams());
    setEmailError(null);
    setPhoneError(null);
  };

  const validateForm = (): boolean => {
    const missingFields: string[] = [];
    let isValid = true;

    if (!dateString) missingFields.push('dateString');
    if (!postalCode) missingFields.push('postalCode');
    if (!city) missingFields.push('city');
    if (!numberOfGuests) missingFields.push('numberOfGuests');
    if (!selectedBar) missingFields.push('selectedBar');
    if (!selectedPackage) missingFields.push('selectedPackage');
    if (!fullName) missingFields.push('fullName');
    if (!email) missingFields.push('email');
    if (!phone) missingFields.push('phone');

    const missingLabels = missingFields.map((key) => fieldLabels[key] || key).filter(Boolean);

    const emailErr = validateEmail(email);
    const phoneErr = validatePhone(phone);

    setEmailError(emailErr);
    setPhoneError(phoneErr);

    if (emailErr) {
      missingFields.push(t(FORM_PAGE_TRANSLATIONS.emailLabel));
      isValid = false;
    }
    if (phoneErr) {
      missingFields.push(t(FORM_PAGE_TRANSLATIONS.phoneLabel));
      isValid = false;
    }

    setFullNameError(null);

    if (!fullName) {
      setFullNameError(t(FORM_PAGE_TRANSLATIONS.nameValidationRequired));
      isValid = false;
    }

    if (missingFields.length > 0) {
      showNotification({
        title: t(FORM_PAGE_TRANSLATIONS.submitErrorTitle),
        message: `${t(FORM_PAGE_TRANSLATIONS.submitErrorMsg)} ${missingLabels.join(', ')}.`,
        color: 'red',
        icon: <IconX size={18} />,
        autoClose: false,
      });
      isValid = false;
    }

    return isValid;
  };

  const { mutate: submitInquiry, isPending: isSubmitting } = useSubmitInquiry();

  function getPackagePrice(
    menuPackages: { name: string; prices: { people: number; price: number }[] }[],
    selectedPackageValue: string,
    numberOfGuests: number,
  ): number {
    const pkg = menuPackages.find(
      (p) => p.name.toUpperCase() === selectedPackageValue.toUpperCase(),
    );
    if (!pkg) return 0;

    const sortedPrices = [...pkg.prices].sort((a, b) => a.people - b.people);
    const selected = sortedPrices.find((p) => numberOfGuests <= p.people) ?? sortedPrices.at(-1);

    return selected?.price ?? 0;
  }

  const handleSubmit = async (): Promise<void> => {
    const isValid = validateForm();
    if (!isValid) return;

    const guests = Number(numberOfGuests);

    const packagePrice = getPackagePrice(
      offerData?.menuPackages ?? [],
      selectedPackage?.value ?? '',
      guests,
    );

    const selectedExtraServiceObjects = extraServices
      .filter((s) => {
        return selectedServices.some(
          (selected) => selected === s.label || selected.includes(` x ${s.label}`),
        );
      })
      .map((s) => {
        const count = serviceCounts[s.label] || 1;
        const formattedLabel = count > 1 ? `${count} x ${s.label}` : s.label;
        return {
          ...s,
          label: formattedLabel,
          price: s.price * count,
        };
      });

    submitInquiry(
      {
        date: dateString ?? '',
        fullName,
        email,
        phone,
        numberOfGuests: Number(numberOfGuests),
        venueLocation: `${postalCode.trim()} ${city.trim()}`,
        selectedPackage: selectedPackage?.value ?? '',
        selectedBar,
        selectedServices,
        notes,
        isIndividualOffer,
        turnstileToken: captchaToken,
      },
      {
        onSuccess: async () => {
          try {
            const extrasTotal = selectedExtraServiceObjects.reduce((sum, s) => sum + s.price, 0);
            const totalCost = (packagePrice ?? 0) + (travelCost ?? 0) + extrasTotal;

            await fetch(env.api.sendInquiryEmail, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fullName,
                email,
                phone,
                venueLocation: `${postalCode.trim()} ${city.trim()}`,
                selectedPackage: selectedPackage?.value ?? '',
                selectedBar,
                selectedServices: selectedExtraServiceObjects,
                notes,
                numberOfGuests,
                date: dateString,
                packagePrice,
                travelCost,
                totalCost,
                isIndividualOffer,
              }),
            });

            showNotification({
              title: t(FORM_PAGE_TRANSLATIONS.submitSuccessTitle),
              message: t(FORM_PAGE_TRANSLATIONS.submitSuccessMsg),
              color: 'green',
              icon: <IconCheck size={18} />,
            });

            navigate('/');
            resetForm();
          } catch (emailError) {
            console.error('Email send failed', emailError);
            showNotification({
              title: t(FORM_PAGE_TRANSLATIONS.submitSuccessTitle),
              message: `${t(FORM_PAGE_TRANSLATIONS.submitSuccessMsg)} (but email failed)`,
              color: 'orange',
              icon: <IconX size={18} />,
            });
          }
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
    const fileName = buildPdfFileName(pkg.value, resolvedRange);
    const url = getPdfUrl(fileName);

    setPackagePdfUrl(url ?? null);
  };

  const handleFieldChange =
    (
      setter: (v: string) => void,
      errorSetter: (e: string | null) => void,
      validator?: (v: string) => string | null,
    ) =>
    (value: string) => {
      setter(value);
      if (validator) {
        errorSetter(validator(value));
      } else if (value.trim() !== '') {
        errorSetter(null);
      }
    };

  const currentPackagePrice = selectedPackage
    ? getPackagePrice(
        offerData?.menuPackages ?? [],
        selectedPackage?.value ?? '',
        Number(numberOfGuests),
      )
    : null;

  const selectedExtraServices =
    offerData?.extraServices
      .filter((s) =>
        selectedServices.some(
          (selected) => selected === s.label || selected.includes(` x ${s.label}`),
        ),
      )
      .map((s) => {
        const count = serviceCounts[s.label] || 1;
        const formattedLabel = count > 1 ? `${count} x ${s.label}` : s.label;
        return {
          ...s,
          label: formattedLabel,
          price: s.price * count,
        };
      }) ?? [];

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

        <Stack gap={4}>
          <Text size="sm" fw={500}>
            {t(FORM_PAGE_TRANSLATIONS.checkDateLabel)}
            <Text span c="red" ml={4}>
              *
            </Text>
          </Text>

          <Group align="center" gap="sm" wrap="nowrap">
            <DateInput
              placeholder={t(FORM_PAGE_TRANSLATIONS.checkDateLabel)}
              value={dateString}
              onChange={handleDateChange}
              valueFormat="YYYY-MM-DD"
              locale="pl"
              disabled={availabilityLoading}
              minDate={minSelectableDate}
              maxDate={lastCheckedDateObj ?? undefined}
              leftSection={<IconCalendar size={18} />}
              style={{ maxWidth: 250 }}
              inputMode="none"
            />

            {availabilityLoading && offerLoading && (
              <>
                <Loader size="xs" />
                <Text size="sm" c="dimmed">
                  {t(FORM_PAGE_TRANSLATIONS.loadingAvailability)}
                </Text>
              </>
            )}
          </Group>
        </Stack>

        {dateStatus === 'unavailable' && (
          <Text c="red" size="sm">
            {t(FORM_PAGE_TRANSLATIONS.dateUnavailable)}
          </Text>
        )}

        {dateStatus === 'available' && (
          <>
            <FormDivider
              label={
                <>
                  {t(FORM_PAGE_TRANSLATIONS.barSelectionTitle)}
                  <Text component="span" c="red" ml={4}>
                    *
                  </Text>
                </>
              }
            />

            <SimpleGrid
              cols={{ base: isMobile ? 1 : 2, sm: 2 }}
              spacing="md"
              p={isMobile ? 0 : 'xl'}
            >
              {barOptions.map((bar) => (
                <BarOptionBox
                  key={bar.value}
                  option={bar}
                  isSelected={selectedBar === bar.value}
                  onSelect={() => handleBarSelect(bar.value)}
                />
              ))}
            </SimpleGrid>

            <FormDivider label={t(FORM_PAGE_TRANSLATIONS.locationLabel)} />

            <Paper p="md" mx={isMobile ? 0 : 'xl'}>
              <Group
                align="flex-start"
                gap="md"
                mb="md"
                style={{
                  flexDirection: isMobile ? 'column' : 'row',
                  width: '100%',
                }}
              >
                <TextInput
                  label={t(FORM_PAGE_TRANSLATIONS.postalCodeInputLabel)}
                  placeholder={t(FORM_PAGE_TRANSLATIONS.postalCodePlaceholder)}
                  value={postalCode}
                  onChange={(e) =>
                    handleFieldChange(setPostalCode, setPostalCodeError)(e.currentTarget.value)
                  }
                  error={postalCodeError || undefined}
                  withAsterisk
                  style={{
                    flex: 1,
                    width: isMobile ? '100%' : 'auto',
                  }}
                />

                <TextInput
                  label={t(FORM_PAGE_TRANSLATIONS.cityInputLabel)}
                  placeholder={t(FORM_PAGE_TRANSLATIONS.cityPlaceholder)}
                  value={city}
                  onChange={(e) => handleFieldChange(setCity, setCityError)(e.currentTarget.value)}
                  error={cityError || undefined}
                  withAsterisk
                  style={{
                    flex: 1,
                    width: isMobile ? '100%' : 'auto',
                  }}
                />
              </Group>

              <Group>
                <Button
                  size="xs"
                  loading={travelLoading}
                  onClick={handleFetchTravelCost}
                  disabled={travelLoading || !postalCode || !city}
                >
                  {t(FORM_PAGE_TRANSLATIONS.calculateTravelCostButtonText)}
                </Button>

                {travelCost !== null && !travelLoading && (
                  <Text size="sm">
                    {t(FORM_PAGE_TRANSLATIONS.travelCostLabel)}{' '}
                    {travelCost === 0
                      ? t(FORM_PAGE_TRANSLATIONS.freeTravelCostLabel)
                      : `${travelCost} ${t(COMMON.pln)}`}
                  </Text>
                )}
              </Group>

              {travelError && (
                <Text size="xs" c="red" mt={4}>
                  {travelError}
                </Text>
              )}

              <NumberInput
                mt="md"
                label={t(FORM_PAGE_TRANSLATIONS.guestsLabel)}
                placeholder={t(FORM_PAGE_TRANSLATIONS.guestsPlaceholder)}
                value={numberOfGuests}
                onChange={(value) => {
                  if (typeof value === 'number' || value === '') {
                    setNumberOfGuests(value);
                  }
                }}
                min={0}
                withAsterisk
                style={{ maxWidth: 200 }}
              />
            </Paper>

            <FormDivider
              label={
                <>
                  {t(FORM_PAGE_TRANSLATIONS.menuSelectionTitle)}{' '}
                  <Text component="span" c="red" ml={4}>
                    *
                  </Text>
                </>
              }
            />

            <CenteredGrid
              items={menuPackages}
              getKey={(pkg) => pkg.value}
              isMobile={isMobile}
              renderItem={(pkg) => (
                <MenuPackageBox
                  pkg={pkg}
                  isSelected={selectedPackage?.value === pkg.value}
                  onSelect={() => handlePackageSelect(pkg)}
                  onOpenModal={() => openPackageModal(pkg)}
                />
              )}
            />

            <FormDivider label={t(FORM_PAGE_TRANSLATIONS.additionalServicesTitle)} />

            <CenteredGrid
              items={extraServices}
              getKey={(service) => service.id}
              isMobile={isMobile}
              renderItem={(service) => (
                <ExtraServiceBox
                  service={service}
                  isSelected={selectedServices.some(
                    (s) => s === service.label || s.includes(` x ${service.label}`),
                  )}
                  onToggle={(count) => toggleServiceSelection(service.label, count)}
                  hasCalculator={service.id === 'hoshizaki'}
                  initialCount={serviceCounts[service.label] || 0}
                />
              )}
            />

            <FormDivider label={t(FORM_PAGE_TRANSLATIONS.additionalInfoLabel)} />

            <Textarea
              label={t(FORM_PAGE_TRANSLATIONS.additionalInfoLabel)}
              placeholder={t(FORM_PAGE_TRANSLATIONS.additionalInfoPlaceholder)}
              autosize
              minRows={3}
              value={notes}
              onChange={(event) => setNotes(event.currentTarget.value)}
            />

            <FormDivider label={t(FORM_PAGE_TRANSLATIONS.contactTitle)} />

            <TextInput
              label={t(FORM_PAGE_TRANSLATIONS.nameLabel)}
              placeholder={t(FORM_PAGE_TRANSLATIONS.namePlaceholder)}
              required
              value={fullName}
              error={fullNameError || undefined}
              onChange={(e) =>
                handleFieldChange(setFullName, setFullNameError)(e.currentTarget.value)
              }
            />

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <TextInput
                label={t(FORM_PAGE_TRANSLATIONS.emailLabel)}
                placeholder={t(FORM_PAGE_TRANSLATIONS.emailPlaceholder)}
                type="email"
                required
                value={email}
                onChange={(e) =>
                  handleFieldChange(setEmail, setEmailError, validateEmail)(e.currentTarget.value)
                }
                error={emailError || undefined}
              />

              <TextInput
                label={t(FORM_PAGE_TRANSLATIONS.phoneLabel)}
                placeholder={t(FORM_PAGE_TRANSLATIONS.phonePlaceholder)}
                type="tel"
                required
                value={phone}
                onChange={(e) =>
                  handleFieldChange(setPhone, setPhoneError, validatePhone)(e.currentTarget.value)
                }
                error={phoneError || undefined}
              />
            </SimpleGrid>

            <Turnstile
              sitekey={env.turnstile.siteKey}
              onVerify={(token) => setCaptchaToken(token)}
            />

            <Button
              size="lg"
              mt="xl"
              fullWidth
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {t(FORM_PAGE_TRANSLATIONS.submit)}
            </Button>
          </>
        )}

        <Space h={100} />
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
        isIndividualOffer={isIndividualOffer}
      />
    </Container>
  );
};

export default FormPage;
