import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Divider,
  Group,
  Image,
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
import { extraServices, barOptions, menuPackages, guestRanges } from '../config/formConfig';
import PageLayout from '../components/PageLayout';

const FormPage = (): React.JSX.Element => {
  const [dateString, setDateString] = useState<string | null>(null);
  const [dateStatus, setDateStatus] = useState<'available' | 'unavailable' | 'pending' | null>(
    null,
  );

  const [notes, setNotes] = useState<string>('');
  const [selectedBar, setSelectedBar] = useState<string | null>(null);
  const [venueLocation, setVenueLocation] = useState<string>('');
  const [numberOfGuests, setNumberOfGuests] = useState<number | ''>('');
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [modalService, setModalService] = useState<null | (typeof extraServices)[0]>(null);

  const checkDateAvailability = async (date: string): Promise<'available' | 'unavailable'> => {
    setDateStatus('pending');
    await new Promise((res) => setTimeout(res, 1500));

    const unavailableDates = ['2025-09-01', '2025-08-31'];
    return unavailableDates.includes(date) ? 'unavailable' : 'available';
  };

  const handleDateChange = async (value: string | null): Promise<void> => {
    setDateString(value);
    if (!value) {
      setDateStatus(null);
      return;
    }

    const status = await checkDateAvailability(value);
    setDateStatus(status);
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
        title: 'Błąd',
        message: 'Uzupełnij wszystkie wymagane pola: data, lokalizacja, liczba gości.',
        color: 'red',
        icon: <IconX size={18} />,
      });
      return;
    }

    showNotification({
      title: 'Formularz wysłany!',
      message: 'Dziękujemy za przesłanie formularza. Skontaktujemy się wkrótce.',
      color: 'green',
      icon: <IconCheck size={18} />,
    });

    // TODO: API call here
  };

  return (
    <PageLayout>
      <Container size="md">
        <Space h={20} />

        <Stack gap="xl">
          <Box>
            <Button component={Link} to="/" variant="outline" size="xs">
              ← Powrót do strony głównej
            </Button>
          </Box>

          <Title order={2}>Formularz</Title>

          {/* Date Picker */}
          <DateInput
            label="Sprawdź termin"
            placeholder="Wybierz datę"
            value={dateString}
            onChange={handleDateChange}
            valueFormat="YYYY-MM-DD"
            locale="pl"
            withAsterisk
            disabled={dateStatus === 'pending'}
            minDate={new Date()}
            leftSection={<IconCalendar size={18} />}
            style={{ maxWidth: 250 }}
          />

          {/* Date status feedback */}
          {dateStatus === 'pending' && (
            <Text c="dimmed" size="sm">
              Sprawdzanie dostępności terminu...
            </Text>
          )}

          {dateStatus === 'unavailable' && (
            <Text c="red" size="sm">
              Termin zajęty, wybierz inny termin.
            </Text>
          )}

          {/* Main form fields – only when available */}
          {dateStatus === 'available' && (
            <>
              <Divider label="Wybór baru" labelPosition="center" />

              <Box>
                <Title order={3} ta="center" mb="md">
                  OFERUJEMY 3 ARANŻACJE BARU DO WYBORU
                </Title>

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
                        onClick={(): void => handleBarSelect(bar.value)}
                      >
                        Wybierz
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
                    NIE POTRZEBUJEMY BARU, na sali jest bar, z którego można skorzystać
                  </Button>
                </Box>
              </Box>

              <Divider label="Lokalizacja i liczba gości" labelPosition="center" />

              <TextInput
                label="Kod pocztowy i miejscowość"
                placeholder="np. 00-001 Warszawa"
                value={venueLocation}
                onChange={(e): void => setVenueLocation(e.currentTarget.value)}
              />

              <NumberInput
                label="Planowana liczba gości"
                placeholder="np. 120"
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
                  Zostaniesz dopasowany do przedziału: <strong>do {matchedRange} osób</strong>
                </Text>
              )}

              <Divider label="Wybór pakietu menu" labelPosition="center" />

              <Box>
                <Title order={3} ta="center" mb="md">
                  Wybierz pakiet menu
                </Title>

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
                        WYBIERAM
                      </Button>
                    </Paper>
                  ))}
                </SimpleGrid>
              </Box>

              <Divider label="Usługi dodatkowe" labelPosition="center" />

              <Box>
                <Title order={3} ta="center" mb="md">
                  Usługi dodatkowe
                </Title>

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
                            {isSelected ? 'Wybrano' : 'Wybierz'}
                          </Button>
                        </Stack>
                      </Paper>
                    );
                  })}
                </SimpleGrid>
              </Box>

              <Divider label="Dodatkowe informacje" labelPosition="center" />

              <Textarea
                name="notes"
                label="Uwagi, dodatkowe informacje"
                placeholder="Napisz tutaj, jeśli masz dodatkowe informacje lub pytania..."
                autosize
                minRows={3}
                value={notes}
                onChange={(event): void => setNotes(event.currentTarget.value)}
              />

              <Button size="lg" mt="xl" fullWidth onClick={handleSubmit}>
                Wyślij formularz
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
