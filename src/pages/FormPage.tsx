import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Divider,
  Group,
  Image,
  Loader,
  Modal,
  NumberInput,
  Paper,
  SimpleGrid,
  Space,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconInfoCircle, IconCheck, IconX, IconCalendar } from '@tabler/icons-react';
import { showNotification } from '@mantine/notifications';
import { extraServices, barOptions, menuPackages, guestRanges } from '@/config/formConfig';
import PageLayout from '@/components/PageLayout';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { FORM_PAGE_TRANSLATIONS } from '@/i18n/tKeys';

type AvailabilityEntry = {
  date: string;
  available: boolean;
};

const FormPage = (): React.JSX.Element => {
  const { t } = useTranslation();

  const [dateString, setDateString] = useState<string | null>(null);
  const [dateStatus, setDateStatus] = useState<'available' | 'unavailable' | 'pending' | null>(
    null,
  );

  const [availability, setAvailability] = useState<AvailabilityEntry[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState<boolean>(true);

  const [notes, setNotes] = useState<string>('');
  const [selectedBar, setSelectedBar] = useState<string | null>(null);
  const [venueLocation, setVenueLocation] = useState<string>('');
  const [numberOfGuests, setNumberOfGuests] = useState<number | ''>('');
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [modalService, setModalService] = useState<null | (typeof extraServices)[0]>(null);

  const fetchAvailability = async (): Promise<void> => {
    setAvailabilityLoading(true);
    try {
      const res = await fetch('/.netlify/functions/get-availability');
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

  const handleDateChange = (value: string | null): void => {
    setDateString(value);
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

  const getClosestGuestRange = (count: number): number | null => {
    return guestRanges.find((limit) => count <= limit) || null;
  };

  const matchedRange =
    typeof numberOfGuests === 'number' ? getClosestGuestRange(numberOfGuests) : null;

  const handlePackageSelect = (value: string): void => {
    setSelectedPackage(value);
  };

  const toggleServiceSelection = (value: string): void => {
    setSelectedServices((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const handleSubmit = (): void => {
    if (!dateString || !numberOfGuests || !venueLocation) {
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

    // TODO: Send data to backend
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
                  <Paper
                    key={bar.value}
                    shadow="md"
                    radius="md"
                    p="sm"
                    withBorder
                    style={{ textAlign: 'center' }}
                  >
                    <Image
                      src={bar.image}
                      alt={bar.label}
                      height={150}
                      fit="cover"
                      radius="md"
                      mb="sm"
                    />
                    <Text fw={500} mb="xs">
                      {bar.label}
                    </Text>
                    <Button
                      fullWidth
                      variant={selectedBar === bar.value ? 'filled' : 'light'}
                      onClick={() => handleBarSelect(bar.value)}
                    >
                      {t(FORM_PAGE_TRANSLATIONS.select)}
                    </Button>
                  </Paper>
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
              />

              {matchedRange && (
                <Text size="sm" c="dimmed">
                  {t(FORM_PAGE_TRANSLATIONS.guestRangeText, { range: matchedRange })}
                </Text>
              )}

              <Divider
                label={t(FORM_PAGE_TRANSLATIONS.menuSelectionTitle)}
                labelPosition="center"
              />

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
                {menuPackages.map((pkg) => (
                  <Paper
                    key={pkg.value}
                    shadow="md"
                    radius="md"
                    p="sm"
                    withBorder
                    style={{ textAlign: 'center' }}
                  >
                    <Image
                      src={pkg.thumbnail}
                      alt={pkg.label}
                      height={120}
                      fit="cover"
                      radius="md"
                      mb="xs"
                      style={{ cursor: 'pointer' }}
                      onClick={() => window.open(pkg.pdfUrl, '_blank')}
                    />
                    <Text fw={500} mb="xs">
                      {pkg.label}
                    </Text>
                    <Button
                      fullWidth
                      variant={selectedPackage === pkg.value ? 'filled' : 'light'}
                      onClick={() => handlePackageSelect(pkg.value)}
                    >
                      {t(FORM_PAGE_TRANSLATIONS.chooseMenu)}
                    </Button>
                  </Paper>
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
                    <Paper
                      key={service.value}
                      shadow="md"
                      radius="md"
                      p="sm"
                      withBorder
                      style={{
                        height: 300,
                        borderColor: isSelected ? '#228be6' : undefined,
                        borderWidth: isSelected ? 2 : undefined,
                      }}
                    >
                      <Stack gap="xs" style={{ height: '100%' }}>
                        <Image
                          src={service.image}
                          alt={service.label}
                          height={150}
                          fit="cover"
                          radius="md"
                        />

                        <Group justify="space-between" align="start">
                          <Box>
                            <Text fw={600} size="sm">
                              {service.label}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {service.price}
                            </Text>
                          </Box>

                          <Button
                            variant="subtle"
                            color="gray"
                            size="compact-sm"
                            px={4}
                            ml="auto"
                            onClick={() => setModalService(service)}
                          >
                            <IconInfoCircle size={18} />
                          </Button>
                        </Group>

                        <Button
                          fullWidth
                          variant={isSelected ? 'filled' : 'light'}
                          onClick={() => toggleServiceSelection(service.value)}
                          mt="auto"
                        >
                          {t(
                            isSelected
                              ? FORM_PAGE_TRANSLATIONS.selectedService
                              : FORM_PAGE_TRANSLATIONS.selectService,
                          )}
                        </Button>
                      </Stack>
                    </Paper>
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
          title={modalService?.label}
          centered
        >
          <Text size="sm">{modalService?.description}</Text>
        </Modal>
      </Container>
    </PageLayout>
  );
};

export default FormPage;
