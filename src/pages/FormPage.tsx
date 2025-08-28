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
import { extraServices, barOptions, menuPackages } from '@/config/formConfig';
import PageLayout from '@/components/PageLayout';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { FORM_PAGE_TRANSLATIONS } from '@/i18n/tKeys';
import { buildPdfFileName, getPdfUrl } from '@/core/utils/helpers';
import { env } from '@/config/env';
import ExtraServiceBox from '@/components/ExtraServiceBox';
import MenuPackageBox from '@/components/MenuPackageBox';
import BarOptionBox from '@/components/BarOptionBox';

const PACKAGE_AVAILABLE_RANGES: Record<string, number[]> = {
  basic: [50, 100, 120, 130, 150, 180, 200, 250, 300, 350, 400],
  medium: [50, 100, 120, 130, 150, 180, 200, 250, 300, 350, 400],
  max: [50, 100, 120, 130, 150, 180, 200, 250, 300, 350, 400],
  classic: [50, 100, 120, 150, 180, 200, 250, 300],
  excellent: [50, 100, 120, 150, 180, 200],
};

const pickClosestAvailableRange = (target: number, avail: number[]): number => {
  let best = avail[0];
  let bestDiff = Math.abs(avail[0] - target);
  for (let i = 1; i < avail.length; i++) {
    const d = Math.abs(avail[i] - target);
    if (d < bestDiff || (d === bestDiff && avail[i] > best)) {
      best = avail[i];
      bestDiff = d;
    }
  }
  return best;
};

const computeIntendedRange = (guests: number | ''): number | null => {
  if (guests === '' || isNaN(Number(guests))) return null;
  const n = Number(guests);
  if (n <= 50) return 50;

  const baseRanges = [100, 120, 130, 150, 180, 200, 250, 300, 400];
  return baseRanges.find((r) => n <= r) ?? baseRanges[baseRanges.length - 1];
};

type AvailabilityEntry = {
  date: string;
  available: boolean;
};

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

  const [availability, setAvailability] = useState<AvailabilityEntry[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState<boolean>(true);

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

  const fetchAvailability = async (): Promise<void> => {
    setAvailabilityLoading(true);
    try {
      const res = await fetch(env.netlify.functions.getAvailability);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const raw: unknown = await res.json();

      const mapped: AvailabilityEntry[] = Array.isArray(raw)
        ? raw
            .filter((d): d is string => typeof d === 'string' && d.trim().length > 0)
            .map((date) => ({ date, available: true }))
        : [];

      setAvailability(mapped);
    } catch (err) {
      console.error('Failed to load availability:', err);
      showNotification({
        title: t(FORM_PAGE_TRANSLATIONS.availabilityErrorTitle),
        message: t(FORM_PAGE_TRANSLATIONS.availabilityErrorMsg),
        color: 'red',
        icon: <IconX size={18} />,
      });
    } finally {
      setAvailabilityLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  useEffect(() => {
    if (!dateString || availability.length === 0) return;

    const normalized = dayjs(dateString).format('YYYY-M-D');
    const match = availability.find((entry) => entry.date === normalized);

    if (match) {
      setDateStatus(match.available ? 'available' : 'unavailable');
    } else {
      setDateStatus('unavailable');
    }
  }, [availability, dateString]);

  const handleDateChange = (value: string | null): void => {
    setDateString(value);

    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set('date', value);
    } else {
      newParams.delete('date');
    }
    setSearchParams(newParams);

    if (!value) {
      setDateStatus(null);
      return;
    }

    setDateStatus('pending');

    const normalized = dayjs(value).format('YYYY-M-D');
    const match = availability.find((entry) => entry.date === normalized);

    if (match) {
      setDateStatus(match.available ? 'available' : 'unavailable');
    } else {
      setDateStatus('unavailable');
    }
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
    const intended = computeIntendedRange(numberOfGuests);
    setModalPackage(pkg);

    if (!intended) {
      setPackagePdfUrl(null);
      return;
    }

    const avail = PACKAGE_AVAILABLE_RANGES[pkg.value] ?? [];
    const resolvedRange = avail.length ? pickClosestAvailableRange(intended, avail) : intended;

    const fileName = buildPdfFileName(pkg.value, resolvedRange);
    const url = getPdfUrl(fileName);

    if (!url) {
      setPackagePdfUrl(null);
      return;
    }

    setPackagePdfUrl(url);
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
                leftSection={<IconCalendar size={18} />}
                style={{ maxWidth: 250 }}
              />

              {availabilityLoading && (
                <>
                  <Loader size="xs" />
                  <Text size="sm" c="dimmed">
                    {t(FORM_PAGE_TRANSLATIONS.loadingAvailability)}
                  </Text>
                </>
              )}
            </Group>
          </Stack>

          {!availabilityLoading && dateStatus === 'pending' && (
            <Text size="sm" c="dimmed">
              {t(FORM_PAGE_TRANSLATIONS.checkingAvailability)}
            </Text>
          )}

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
                  const isSelected = selectedServices.includes(service.value);

                  return (
                    <ExtraServiceBox
                      key={service.value}
                      service={service}
                      isSelected={isSelected}
                      onToggle={() => toggleServiceSelection(service.value)}
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

        <Modal
          opened={!!modalPackage}
          onClose={() => {
            setModalPackage(null);
            setPackagePdfUrl(null);
          }}
          title={
            <Text fw="bold" size="lg">
              {modalPackage ? t(modalPackage.label) : null}
            </Text>
          }
          centered
          size="xl"
        >
          <Text size="sm" mb="sm">
            {modalPackage ? t(modalPackage.description) : null}
          </Text>

          {packagePdfUrl && (
            <iframe
              src={packagePdfUrl}
              style={{ width: '100%', height: '60vh', border: 'none' }}
              title="Oferta PDF"
            />
          )}

          {packagePdfUrl && (
            <Group mt="sm" justify="flex-end">
              <Button component="a" href={packagePdfUrl} target="_blank" rel="noopener noreferrer">
                {t(FORM_PAGE_TRANSLATIONS.openInNewTab)}
              </Button>
            </Group>
          )}
        </Modal>
      </Container>
    </PageLayout>
  );
};

export default FormPage;
