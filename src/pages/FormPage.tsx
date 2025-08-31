import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Divider,
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
  Title,
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
import { pickAvailableOrMaxRange, buildAvailableRanges } from '@/core/utils/helpers';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const phoneBasicRegex = /^\+?[0-9\s().-]{7,}$/;

const countDigits = (s: string): number => (s.match(/\d/g) ?? []).length;

const FormPage = (): React.JSX.Element => {
  const { t } = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();
  const dateFromUrl = searchParams.get('date');

  const [dateString, setDateString] = useState<string | null>(dateFromUrl || null);
  const [dateStatus, setDateStatus] = useState<'available' | 'unavailable' | 'pending' | null>(
    null,
  );

  const { data, isLoading: availabilityLoading, error: availabilityError } = useAvailability();
  const { data: offerData, isLoading: offerLoading, error: offerError } = useOffer();

  const extraServices = offerData?.extraServices ?? [];
  const rangesMap = offerData ? buildAvailableRanges(offerData.menuPackages) : null;

  const takenDates = data?.takenDates ?? [];
  const lastCheckedDate = data?.lastCheckedDate ?? null;
  const lastCheckedDateObj = lastCheckedDate ? dayjs(lastCheckedDate, 'YYYY-M-D').toDate() : null;

  const [notes, setNotes] = useState<string>('');
  const [selectedBar, setSelectedBar] = useState<string | null>(null);
  const [venueLocation, setVenueLocation] = useState<string>('');
  const [numberOfGuests, setNumberOfGuests] = useState<number | ''>(100);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [modalService, setModalService] = useState<null | (typeof extraServices)[0]>(null);
  const [modalPackage, setModalPackage] = useState<null | (typeof menuPackages)[0]>(null);
  const [packagePdfUrl, setPackagePdfUrl] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phone, setPhone] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [exceedsMaxRange, setExceedsMaxRange] = useState<number | null>(null);

  const validateEmail = (value: string): string | null => {
    const v = value.trim();

    if (!v) return t(FORM_PAGE_TRANSLATIONS.emailValidationRequired);
    if (!emailRegex.test(v)) return t(FORM_PAGE_TRANSLATIONS.emailValidationInvalid);

    return null;
  };

  const validatePhone = (value: string): string | null => {
    const v = value.trim();

    if (!v) return t(FORM_PAGE_TRANSLATIONS.phoneValidationRequired);
    if (!phoneBasicRegex.test(v)) return t(FORM_PAGE_TRANSLATIONS.phoneValidationInvalid);

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

  useEffect(() => {
    if (!dateString || takenDates?.length === 0) return;

    const normalized = dayjs(dateString).format('YYYY-M-D');
    const match = takenDates.find((entry: string) => entry === normalized);

    if (match) setDateStatus('unavailable');
    else setDateStatus('available');
  }, [takenDates, dateString]);

  const handleDateChange = (value: string | null): void => {
    setDateString(value);

    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set('date', value);
    else newParams.delete('date');

    setSearchParams(newParams);

    if (!value) {
      setDateStatus(null);
      return;
    }

    setDateStatus('pending');

    const normalized = dayjs(value).format('YYYY-M-D');
    const match = takenDates?.find((entry: string) => entry === normalized);

    if (match) setDateStatus('unavailable');
    else setDateStatus('available');
  };

  const handleBarSelect = (barType: string): void => {
    setSelectedBar(barType);
  };

  const handleSkip = (): void => {
    setSelectedBar('no-bar');
  };

  const handlePackageSelect = (value: string): void => {
    setSelectedPackage(value);
  };

  const toggleServiceSelection = (value: string): void => {
    setSelectedServices((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const handleSubmit = (): void => {
    const emailErr = validateEmail(email);
    const phoneErr = validatePhone(phone);

    setEmailError(emailErr);
    setPhoneError(phoneErr);

    if (!dateString || !numberOfGuests || !venueLocation || emailErr || phoneErr) {
      showNotification({
        title: t(FORM_PAGE_TRANSLATIONS.submitErrorTitle),
        message: t(FORM_PAGE_TRANSLATIONS.submitErrorMsg),
        color: 'red',
        icon: <IconX size={18} />,
      });
      return;
    }

    showNotification({
      title: t(FORM_PAGE_TRANSLATIONS.submitSuccessTitle),
      message: t(FORM_PAGE_TRANSLATIONS.submitSuccessMsg),
      color: 'green',
      icon: <IconCheck size={18} />,
    });

    // TODO: Send data to backend, including email and phone
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

  return (
    <PageLayout>
      <Container size="md">
        <Space h={20} />
        <Stack gap="xl">
          <Box>
            <Button component={Link} to="/" variant="outline" size="xs">
              {t(FORM_PAGE_TRANSLATIONS.backToHome)}
            </Button>
          </Box>

          <Title order={2}>{t(FORM_PAGE_TRANSLATIONS.title)}</Title>

          <Stack gap={4}>
            <Text size="sm" fw={500}>
              {t(FORM_PAGE_TRANSLATIONS.checkDateLabel)}
              <Text span c="red">
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
                disabled={dateStatus === 'pending' || availabilityLoading}
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
              <Divider label={t(FORM_PAGE_TRANSLATIONS.barSelectionTitle)} labelPosition="center" />

              <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
                {barOptions.map((bar) => (
                  <BarOptionBox
                    key={bar.value}
                    option={bar}
                    isSelected={selectedBar === bar.value}
                    onSelect={() => handleBarSelect(bar.value)}
                  />
                ))}
              </SimpleGrid>

              <Box mt="xl" ta="center">
                <Button
                  variant={selectedBar === 'no-bar' ? 'filled' : 'outline'}
                  color="gray"
                  onClick={handleSkip}
                >
                  {t(FORM_PAGE_TRANSLATIONS.skipBar)}
                </Button>
              </Box>

              <Divider label={t(FORM_PAGE_TRANSLATIONS.locationLabel)} labelPosition="center" />

              <TextInput
                label={t(FORM_PAGE_TRANSLATIONS.locationLabel)}
                placeholder={t(FORM_PAGE_TRANSLATIONS.locationPlaceholder)}
                value={venueLocation}
                onChange={(e) => setVenueLocation(e.currentTarget.value)}
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
                label={t(FORM_PAGE_TRANSLATIONS.menuSelectionTitle)}
                labelPosition="center"
              />

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
                {menuPackages.map((pkg, index) => (
                  <MenuPackageBox
                    key={pkg.value}
                    pkg={pkg}
                    isSelected={selectedPackage === pkg.value}
                    onSelect={() => handlePackageSelect(pkg.value)}
                    onOpenModal={() => openPackageModal(pkg)}
                    isFullWidth={index === menuPackages.length - 1}
                  />
                ))}
              </SimpleGrid>

              <Divider
                label={t(FORM_PAGE_TRANSLATIONS.additionalServicesTitle)}
                labelPosition="center"
              />

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
                {extraServices.map((service) => {
                  const isSelected = selectedServices.includes(service.id);

                  return (
                    <ExtraServiceBox
                      key={service.id}
                      service={service}
                      isSelected={isSelected}
                      onToggle={() => toggleServiceSelection(service.id)}
                      onOpenModal={() => setModalService(service)}
                    />
                  );
                })}
              </SimpleGrid>

              <Divider
                label={t(FORM_PAGE_TRANSLATIONS.additionalInfoLabel)}
                labelPosition="center"
              />

              <Textarea
                label={t(FORM_PAGE_TRANSLATIONS.additionalInfoLabel)}
                placeholder={t(FORM_PAGE_TRANSLATIONS.additionalInfoPlaceholder)}
                autosize
                minRows={3}
                value={notes}
                onChange={(event) => setNotes(event.currentTarget.value)}
              />

              <Divider label={t(FORM_PAGE_TRANSLATIONS.contactTitle)} labelPosition="center" />

              <TextInput
                label={t(FORM_PAGE_TRANSLATIONS.nameLabel)}
                placeholder={t(FORM_PAGE_TRANSLATIONS.namePlaceholder)}
                required
                value={fullName}
                onChange={(e) => {
                  setFullName(e.currentTarget.value);
                }}
              />

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <TextInput
                  label={t(FORM_PAGE_TRANSLATIONS.emailLabel)}
                  placeholder={t(FORM_PAGE_TRANSLATIONS.emailPlaceholder)}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.currentTarget.value);
                    setEmailError(validateEmail(e.currentTarget.value));
                  }}
                  onBlur={(e) => setEmailError(validateEmail(e.currentTarget.value))}
                  error={emailError || undefined}
                />
                <TextInput
                  label={t(FORM_PAGE_TRANSLATIONS.phoneLabel)}
                  placeholder={t(FORM_PAGE_TRANSLATIONS.phonePlaceholder)}
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.currentTarget.value);
                    setPhoneError(validatePhone(e.currentTarget.value));
                  }}
                  onBlur={(e) => setPhoneError(validatePhone(e.currentTarget.value))}
                  error={phoneError || undefined}
                />
              </SimpleGrid>

              <Button size="lg" mt="xl" fullWidth onClick={handleSubmit}>
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
