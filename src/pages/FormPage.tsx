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
  Space,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconInfoCircle } from '@tabler/icons-react';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { extraServices, barOptions, menuPackages, guestRanges } from '../config/formConfig';

const FormPage = (): React.JSX.Element => {
  const [dateString, setDateString] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [selectedBar, setSelectedBar] = useState<string | null>(null);
  const [venueLocation, setVenueLocation] = useState<string>('');
  const [numberOfGuests, setNumberOfGuests] = useState<number | ''>('');
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [modalService, setModalService] = useState<null | (typeof extraServices)[0]>(null);

  const handleBarSelect = (barType: string): void => {
    setSelectedBar(barType);
    console.log('Selected bar:', barType);
  };

  const handleSkip = (): void => {
    setSelectedBar('no-bar');
    console.log('Bar skipped');
  };

  const getClosestGuestRange = (count: number): number | null => {
    return guestRanges.find((limit) => count <= limit) || null;
  };

  const matchedRange =
    typeof numberOfGuests === 'number' ? getClosestGuestRange(numberOfGuests) : null;

  const handlePackageSelect = (value: string): void => {
    setSelectedPackage(value);
    console.log('Selected menu package:', value);
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

    // You can later post the form here
    // Example:
    // axios.post('/api/form', { ...formData })
  };

  return (
    <Container size="md" mt="xl">
      <Stack gap="xl">
        <Box>
          <Button component={Link} to="/" variant="outline" size="xs">
            ← Powrót do strony głównej
          </Button>
        </Box>
        <Title order={2}>Formularz</Title>

        <DateInput
          label="Sprawdź termin"
          placeholder="Wybierz datę"
          value={dateString}
          onChange={setDateString}
          valueFormat="DD.MM.YYYY"
          locale="pl"
          withAsterisk
        />

        <Divider label="Wybór baru" labelPosition="center" />

        <Box>
          <Title order={3} ta="center" mb="md">
            OFERUJEMY 3 ARANŻACJE BARU DO WYBORU
          </Title>

          <Group justify="center" wrap="wrap" gap="xl">
            {barOptions.map((bar) => (
              <Paper
                key={bar.value}
                shadow="md"
                radius="md"
                p="sm"
                withBorder
                style={{ width: 250, textAlign: 'center' }}
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
          </Group>

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

          <Group justify="center" wrap="wrap" gap="xl">
            {menuPackages.map((pkg) => (
              <Paper
                key={pkg.value}
                shadow="md"
                radius="md"
                p="sm"
                withBorder
                style={{ width: 220, textAlign: 'center' }}
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
          </Group>
        </Box>

        <Divider label="Usługi dodatkowe" labelPosition="center" />

        <Box>
          <Title order={3} ta="center" mb="md">
            Usługi dodatkowe
          </Title>

          <Group justify="center" wrap="wrap" gap="xl">
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
                    width: 250,
                    height: 320,
                    position: 'relative',
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

                    <Group justify="space-between" align="start" grow>
                      <Box style={{ flex: 1 }}>
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
          </Group>
        </Box>

        <Divider label="Dodatkowe informacje" labelPosition="center" />

        <Textarea
          label="Uwagi, dodatkowe informacje"
          placeholder="Napisz tutaj, jeśli masz dodatkowe informacje lub pytania..."
          autosize
          minRows={3}
          value={notes}
          onChange={(event): void => setNotes(event.currentTarget.value)}
        />

        <Button size="lg" mt="xl" fullWidth onClick={() => handleSubmit()}>
          Wyślij formularz
        </Button>

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
  );
};

export default FormPage;
