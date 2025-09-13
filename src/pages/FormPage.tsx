import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSubmitInquiry } from '@/core/mutations/useSubmitInquiry';
import Turnstile from 'react-turnstile';
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Group,
  Loader,
  Modal,
  NumberInput,
  SimpleGrid,
  Space,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconCheck, IconX, IconCalendar } from '@tabler/icons-react';
import { showNotification } from '@mantine/notifications';
import { barOptions, menuPackages } from '@/core/config/options';
import PageLayout from '@/components/PageLayout';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { FORM_PAGE_TRANSLATIONS } from '@/i18n/tKeys';
import { buildPdfFileName, getPdfUrl } from '@/core/utils/helpers';
import ExtraServiceBox from '@/components/ExtraServiceBox';
import MenuPackageBox from '@/components/MenuPackageBox';
import BarOptionBox from '@/components/BarOptionBox';
import { useAvailability } from '@/core/queries/useAvailability';
import { useOffer } from '@/core/queries/useOffer';
import MenuPackageModal from '@/components/MenuPackageModal';
import { env } from '@/core/config/env';
import { pickAvailableOrMaxRange, buildAvailableRanges } from '@/core/utils/helpers';
import { regex } from '@/core/utils/regex';
import PageHeader from '@/components/PageHeader';

const countDigits = (s: string): number => (s.match(/\d/g) ?? []).length;
const NO_BAR = 'Bez baru';

const FormPage = (): React.JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const fieldLabels: Record<string, string> = {
    selectedBar: t(FORM_PAGE_TRANSLATIONS.fieldValidationMessageLabel.selectedBar),
    venueLocation: t(FORM_PAGE_TRANSLATIONS.fieldValidationMessageLabel.venueLocation),
    numberOfGuests: t(FORM_PAGE_TRANSLATIONS.fieldValidationMessageLabel.numberOfGuests),
    selectedPackage: t(FORM_PAGE_TRANSLATIONS.fieldValidationMessageLabel.selectedPackage),
    fullName: t(FORM_PAGE_TRANSLATIONS.fieldValidationMessageLabel.fullName),
    email: t(FORM_PAGE_TRANSLATIONS.fieldValidationMessageLabel.email),
    phone: t(FORM_PAGE_TRANSLATIONS.fieldValidationMessageLabel.phone),
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const dateFromUrl = searchParams.get('date');

  const { data, isLoading: availabilityLoading, error: availabilityError } = useAvailability();
  const { data: offerData, isLoading: offerLoading, error: offerError } = useOffer();

  const extraServices = offerData?.extraServices ?? [];
  const rangesMap = offerData ? buildAvailableRanges(offerData.menuPackages) : null;

  const takenDates = data?.takenDates ?? [];
  const lastCheckedDate = data?.lastCheckedDate ?? null;
  const lastCheckedDateObj = lastCheckedDate ? dayjs(lastCheckedDate, 'YYYY-M-D').toDate() : null;

  const [dateString, setDateString] = useState<string | null>(dateFromUrl || null);
  const [notes, setNotes] = useState<string>('');
  const [selectedBar, setSelectedBar] = useState<string | null>(null);
  const [venueLocation, setVenueLocation] = useState<string>('');
  const [venueLocationError, setVenueLocationError] = useState<string | null>(null);
  const [numberOfGuests, setNumberOfGuests] = useState<number | ''>(100);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [modalService, setModalService] = useState<null | (typeof extraServices)[0]>(null);
  const [modalPackage, setModalPackage] = useState<null | (typeof menuPackages)[0]>(null);
  const [packagePdfUrl, setPackagePdfUrl] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string>('');
  const [fullNameError, setFullNameError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phone, setPhone] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [exceedsMaxRange, setExceedsMaxRange] = useState<number | null>(null);

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

  const handleSkip = (): void => {
    setSelectedBar(NO_BAR);
  };

  const handlePackageSelect = (value: string): void => {
    setSelectedPackage(value);
  };

  const toggleServiceSelection = (value: string): void => {
    setSelectedServices((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const resetForm = (): void => {
    setDateString(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setNotes('');
    setVenueLocation('');
    setNumberOfGuests(100);
    setSelectedBar(null);
    setSelectedPackage(null);
    setSelectedServices([]);
    setModalService(null);
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
    if (!venueLocation) missingFields.push('venueLocation');
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
    setVenueLocationError(null);

    if (!fullName) {
      setFullNameError(t(FORM_PAGE_TRANSLATIONS.nameValidationRequired));
      isValid = false;
    }

    if (!venueLocation) {
      setVenueLocationError(t(FORM_PAGE_TRANSLATIONS.locationValidationRequired));
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

  const handleSubmit = async (): Promise<void> => {
    const isValid = validateForm();
    if (!isValid) return;

    submitInquiry(
      {
        date: dateString ?? '',
        fullName,
        email,
        phone,
        numberOfGuests: Number(numberOfGuests),
        venueLocation,
        selectedPackage,
        selectedBar,
        selectedServices,
        notes,
        turnstileToken: captchaToken,
      },
      {
        onSuccess: async () => {
          try {
            await fetch(env.netlify.functions.sendInquiryEmail, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fullName,
                email,
                phone,
                venueLocation,
                selectedPackage,
                selectedBar,
                selectedServices,
                notes,
                numberOfGuests,
                date: dateString,
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

            navigate('/');
            resetForm();
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

  return (
    <PageLayout>
      <Container size="md" style={{ paddingTop: 60, paddingBottom: 60, minHeight: '100vh' }}>
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
                minDate={new Date()}
                maxDate={lastCheckedDateObj ?? undefined}
                leftSection={<IconCalendar size={18} />}
                style={{ maxWidth: 250 }}
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
              <Divider
                label={
                  <>
                    {t(FORM_PAGE_TRANSLATIONS.barSelectionTitle)}
                    <Text component="span" c="red" ml={4}>
                      *
                    </Text>
                  </>
                }
                labelPosition="center"
                styles={{
                  label: {
                    fontSize: '1rem',
                  },
                }}
              />

              <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
                {barOptions.map((bar) => (
                  <BarOptionBox
                    key={bar.value}
                    option={bar}
                    isSelected={selectedBar === bar.label}
                    onSelect={() => handleBarSelect(bar.label)}
                  />
                ))}
              </SimpleGrid>

              <Box mt="xl" ta="center">
                <Button
                  variant={selectedBar === NO_BAR ? 'filled' : 'outline'}
                  color="gray"
                  onClick={handleSkip}
                >
                  {t(FORM_PAGE_TRANSLATIONS.skipBar)}
                </Button>
              </Box>

              <Divider
                label={t(FORM_PAGE_TRANSLATIONS.locationLabel)}
                labelPosition="center"
                styles={{
                  label: {
                    fontSize: '1rem',
                  },
                }}
              />

              <TextInput
                label={t(FORM_PAGE_TRANSLATIONS.locationLabel)}
                placeholder={t(FORM_PAGE_TRANSLATIONS.locationPlaceholder)}
                value={venueLocation}
                error={venueLocationError || undefined}
                onChange={(e) =>
                  handleFieldChange(setVenueLocation, setVenueLocationError)(e.currentTarget.value)
                }
                withAsterisk
              />

              <NumberInput
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
              />

              <Divider
                label={
                  <>
                    {t(FORM_PAGE_TRANSLATIONS.menuSelectionTitle)}{' '}
                    <Text component="span" c="red" ml={4}>
                      *
                    </Text>
                  </>
                }
                labelPosition="center"
                styles={{
                  label: {
                    fontSize: '1rem',
                  },
                }}
              />

              <Grid gutter="xl">
                {menuPackages.map((pkg, i) => {
                  const isLastItem = i === menuPackages.length - 1;
                  const isOdd = menuPackages.length % 2 === 1;

                  return (
                    <Grid.Col key={pkg.value} span={6} offset={isLastItem && isOdd ? 3 : 0}>
                      <MenuPackageBox
                        pkg={pkg}
                        isSelected={selectedPackage === pkg.value}
                        onSelect={() => handlePackageSelect(pkg.value)}
                        onOpenModal={() => openPackageModal(pkg)}
                      />
                    </Grid.Col>
                  );
                })}
              </Grid>

              <Divider
                label={t(FORM_PAGE_TRANSLATIONS.additionalServicesTitle)}
                labelPosition="center"
                styles={{
                  label: {
                    fontSize: '1rem',
                  },
                }}
              />

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
                {extraServices.map((service) => {
                  const isSelected = selectedServices.includes(service.label);

                  return (
                    <ExtraServiceBox
                      key={service.id}
                      service={service}
                      isSelected={isSelected}
                      onToggle={() => toggleServiceSelection(service.label)}
                      onOpenModal={() => setModalService(service)}
                    />
                  );
                })}
              </SimpleGrid>

              <Divider
                label={t(FORM_PAGE_TRANSLATIONS.additionalInfoLabel)}
                labelPosition="center"
                styles={{
                  label: {
                    fontSize: '1rem',
                  },
                }}
              />

              <Textarea
                label={t(FORM_PAGE_TRANSLATIONS.additionalInfoLabel)}
                placeholder={t(FORM_PAGE_TRANSLATIONS.additionalInfoPlaceholder)}
                autosize
                minRows={3}
                value={notes}
                onChange={(event) => setNotes(event.currentTarget.value)}
              />

              <Divider
                label={t(FORM_PAGE_TRANSLATIONS.contactTitle)}
                labelPosition="center"
                styles={{
                  label: {
                    fontSize: '1rem',
                  },
                }}
              />

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

        <Modal
          opened={!!modalService}
          onClose={() => setModalService(null)}
          title={
            <Text fw="bold" size="lg">
              {modalService ? modalService.label : null}
            </Text>
          }
          centered
        >
          <Text size="sm">{modalService ? t(modalService.description) : null}</Text>
        </Modal>

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
      </Container>
    </PageLayout>
  );
};

export default FormPage;
