import { Button, Group, NumberInput, Paper, Stack, Text, TextInput } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { COMMON_TRANSLATIONS, FORM_PAGE_TRANSLATIONS } from '@/i18n/tKeys';
import FormDivider from '@/components/FormDivider';

interface LocationAndGuestsSectionProps {
  isMobile: boolean;
  postalCode: string;
  city: string;
  numberOfGuests: number | '';
  travelCost: number | null;
  travelLoading: boolean;
  travelError: string | null;
  travelLocationName: string | null;
  onPostalCodeChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onGuestsChange: (value: number | '') => void;
  onCalculateTravelCost: () => void;
}

export default function LocationAndGuestsSection({
  isMobile,
  postalCode,
  city,
  numberOfGuests,
  travelCost,
  travelLoading,
  travelError,
  travelLocationName,
  onPostalCodeChange,
  onCityChange,
  onGuestsChange,
  onCalculateTravelCost,
}: LocationAndGuestsSectionProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <>
      <FormDivider label={t(FORM_PAGE_TRANSLATIONS.locationLabel)} />
      <Paper p="md" mx={isMobile ? 0 : 'xl'}>
        <Group
          align="flex-start"
          gap="md"
          mb="md"
          style={{ flexDirection: isMobile ? 'column' : 'row', width: '100%' }}
        >
          <TextInput
            label={t(FORM_PAGE_TRANSLATIONS.postalCodeInputLabel)}
            placeholder={t(FORM_PAGE_TRANSLATIONS.postalCodePlaceholder)}
            withAsterisk
            maxLength={10}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            style={{ flex: 1, width: isMobile ? '100%' : 'auto' }}
            value={postalCode}
            onChange={(event) => onPostalCodeChange(event.currentTarget.value)}
          />
          <TextInput
            label={t(FORM_PAGE_TRANSLATIONS.cityInputLabel)}
            placeholder={t(FORM_PAGE_TRANSLATIONS.cityPlaceholder)}
            withAsterisk
            maxLength={110}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            style={{ flex: 1, width: isMobile ? '100%' : 'auto' }}
            value={city}
            onChange={(event) => onCityChange(event.currentTarget.value)}
          />
        </Group>
        <Group>
          <Button
            size="xs"
            loading={travelLoading}
            onClick={onCalculateTravelCost}
            disabled={travelLoading || !postalCode || !city}
          >
            {t(FORM_PAGE_TRANSLATIONS.calculateTravelCostButtonText)}
          </Button>
          {travelCost !== null && !travelLoading && (
            <Stack gap={4}>
              <Text size="sm" fw={600}>
                {t(FORM_PAGE_TRANSLATIONS.travelCostLabel)}{' '}
                {travelCost === 0
                  ? t(FORM_PAGE_TRANSLATIONS.freeTravelCostLabel)
                  : `${travelCost} ${t(COMMON_TRANSLATIONS.pln)}`}
              </Text>
              {travelLocationName && (
                <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                  {t(FORM_PAGE_TRANSLATIONS.foundLocationLabel, {
                    locationName: travelLocationName,
                  })}
                </Text>
              )}
            </Stack>
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
            if (typeof value === 'number' || value === '') onGuestsChange(value);
          }}
          min={0}
          withAsterisk
          style={{ maxWidth: 200 }}
        />
      </Paper>
    </>
  );
}
