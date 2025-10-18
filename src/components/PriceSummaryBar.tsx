import { Flex, Paper, Stack, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { PRICE_SUMMARY_BAR_TRANSLATIONS } from '@/i18n/tKeys';
import { useMediaQuery } from '@mantine/hooks';

interface PriceSummaryBarProps {
  packageLabel: string | null;
  packagePrice: number | null;
  extraServices: { label: string; price: number }[];
  travelCost: number | null;
}

const PriceSummaryBar = ({
  packageLabel,
  packagePrice,
  extraServices,
  travelCost,
}: PriceSummaryBarProps): React.JSX.Element => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const extrasTotal = extraServices.reduce((sum, s) => sum + s.price, 0);
  const total = (packagePrice ?? 0) + (travelCost ?? 0) + extrasTotal;

  return (
    <Paper
      withBorder
      shadow="sm"
      p="md"
      pos="fixed"
      bottom={0}
      left={0}
      right={0}
      style={{
        background: '#fff',
        borderTop: '1px solid #e9ecef',
        zIndex: 1000,
      }}
    >
      <Flex justify="space-between" align="flex-start" wrap="wrap" gap="md">
        <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
          {packageLabel && packagePrice !== null && (
            <Text size={isMobile ? 'xs' : 'sm'}>
              <Text span fw={600}>
                {t(PRICE_SUMMARY_BAR_TRANSLATIONS.packageLabel)}
              </Text>{' '}
              {packageLabel} – {packagePrice} PLN
            </Text>
          )}

          {extraServices.length > 0 && (
            <Text size={isMobile ? 'xs' : 'sm'}>
              <Text span fw={600}>
                {t(PRICE_SUMMARY_BAR_TRANSLATIONS.extrasLabel)}
              </Text>{' '}
              {extraServices.map((s) => `${s.label}: ${s.price} PLN`).join(', ')}
            </Text>
          )}

          {travelCost !== null && (
            <Text size={isMobile ? 'xs' : 'sm'}>
              <Text span fw={600}>
                {t(PRICE_SUMMARY_BAR_TRANSLATIONS.travelCostLabel)}
              </Text>{' '}
              {travelCost === 0
                ? t(PRICE_SUMMARY_BAR_TRANSLATIONS.travelCostFree)
                : `${travelCost} PLN`}
            </Text>
          )}
        </Stack>

        <Stack gap={2} style={{ minWidth: 100, textAlign: 'right' }}>
          <Text size="sm" fw={600}>
            {t(PRICE_SUMMARY_BAR_TRANSLATIONS.totalLabel)}
          </Text>
          <Text size="lg" fw={700} c="primary">
            {total} PLN
          </Text>
        </Stack>
      </Flex>
    </Paper>
  );
};

export default PriceSummaryBar;
