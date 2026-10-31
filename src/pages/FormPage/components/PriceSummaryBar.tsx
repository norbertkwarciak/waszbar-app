import { useState } from 'react';
import {
  ActionIcon,
  Box,
  Button,
  Collapse,
  Drawer,
  Flex,
  Group,
  Paper,
  Stack,
  Text,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconChevronDown, IconChevronUp, IconListDetails, IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import {
  COMMON_TRANSLATIONS,
  FORM_PAGE_TRANSLATIONS,
  PRICE_SUMMARY_BAR_TRANSLATIONS,
} from '@/i18n/tKeys';

interface SelectedExtra {
  key: string;
  label: string;
  price: number;
}

interface PriceSummaryBarProps {
  packageLabel: string | null;
  packagePrice: number | null;
  extraServices: SelectedExtra[];
  travelCost: number | null;
  outdoorTentLabel?: string | null;
  outdoorTentPrice?: number | null;
  isIndividualOffer?: boolean;
  onRemoveOutdoorTent: () => void;
  onRemovePackage: () => void;
  onRemoveExtraService: (key: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

const PriceSummaryBar = ({
  packageLabel,
  packagePrice,
  extraServices,
  travelCost,
  outdoorTentLabel = null,
  outdoorTentPrice = null,
  isIndividualOffer = false,
  onRemoveOutdoorTent,
  onRemovePackage,
  onRemoveExtraService,
  onSubmit,
  isSubmitting = false,
}: PriceSummaryBarProps): React.JSX.Element => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopDrawerOpen, setDesktopDrawerOpen] = useState(false);

  const showPackageRow = packageLabel !== null && packagePrice !== null && !isIndividualOffer;
  const showOutdoorTentRow = outdoorTentLabel !== null && outdoorTentPrice !== null;
  const showExtrasRows = extraServices.length > 0;
  const showTravelRow = travelCost !== null;
  const hasAnyItems = showPackageRow || showOutdoorTentRow || showExtrasRows || showTravelRow;

  const extrasTotal = extraServices.reduce((sum, s) => sum + s.price, 0);
  const total = (packagePrice ?? 0) + (travelCost ?? 0) + extrasTotal + (outdoorTentPrice ?? 0);

  const renderRow = (
    content: React.ReactNode,
    onRemove?: () => void,
    key?: string,
  ): React.JSX.Element => (
    <Group key={key} gap="xs" wrap="nowrap" align="center">
      <Text size={isMobile ? 'xs' : 'sm'} style={{ flex: 1, minWidth: 0 }}>
        {content}
      </Text>
      {onRemove && (
        <ActionIcon
          variant="subtle"
          color="gray"
          size="sm"
          onClick={onRemove}
          aria-label={t(PRICE_SUMMARY_BAR_TRANSLATIONS.removeAria)}
        >
          <IconX size={14} />
        </ActionIcon>
      )}
    </Group>
  );

  const itemsList = (
    <Stack gap={4}>
      {showPackageRow &&
        renderRow(
          <>
            <Text span fw={600}>
              {t(PRICE_SUMMARY_BAR_TRANSLATIONS.packageLabel)}
            </Text>{' '}
            {packageLabel} – {packagePrice} {t(COMMON_TRANSLATIONS.pln)}
          </>,
          onRemovePackage,
        )}

      {showOutdoorTentRow &&
        renderRow(
          <>
            <Text span fw={600}>
              {t(PRICE_SUMMARY_BAR_TRANSLATIONS.outdoorTentLabel)}
            </Text>{' '}
            {outdoorTentLabel} – {outdoorTentPrice} {t(COMMON_TRANSLATIONS.pln)}
          </>,
          onRemoveOutdoorTent,
        )}

      {extraServices.map((s) =>
        renderRow(
          <>
            <Text span fw={600}>
              {t(PRICE_SUMMARY_BAR_TRANSLATIONS.extraItemLabel)}
            </Text>{' '}
            {s.label} – {s.price} {t(COMMON_TRANSLATIONS.pln)}
          </>,
          () => onRemoveExtraService(s.key),
          s.key,
        ),
      )}

      {showTravelRow &&
        renderRow(
          <>
            <Text span fw={600}>
              {t(PRICE_SUMMARY_BAR_TRANSLATIONS.travelCostLabel)}
            </Text>{' '}
            {travelCost === 0
              ? t(PRICE_SUMMARY_BAR_TRANSLATIONS.travelCostFree)
              : `${travelCost} ${t(COMMON_TRANSLATIONS.pln)}`}
          </>,
        )}
    </Stack>
  );

  const totalDisplay = isIndividualOffer ? (
    <Text size={isMobile ? 'md' : 'lg'} fw={700} c="red" style={{ wordBreak: 'break-word' }}>
      {t(PRICE_SUMMARY_BAR_TRANSLATIONS.individualOfferLabel)}
    </Text>
  ) : (
    <Text size={isMobile ? 'md' : 'lg'} fw={700} c="primary">
      {total} {t(COMMON_TRANSLATIONS.pln)}
    </Text>
  );

  const submitButton = (
    <Button
      size={isMobile ? 'md' : 'lg'}
      onClick={onSubmit}
      loading={isSubmitting}
      disabled={isSubmitting}
      fullWidth
    >
      {t(FORM_PAGE_TRANSLATIONS.submit)}
    </Button>
  );

  const disclaimer = (
    <Text
      size="xs"
      c="dimmed"
      style={{ whiteSpace: 'pre-line', textAlign: 'center', lineHeight: 1.3 }}
    >
      {t(FORM_PAGE_TRANSLATIONS.submitDisclaimer)}
    </Text>
  );

  if (isMobile) {
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
          zIndex: 199,
        }}
      >
        {hasAnyItems && (
          <Collapse in={mobileOpen}>
            <Box pb="sm" style={{ maxHeight: '40vh', overflowY: 'auto' }}>
              {itemsList}
            </Box>
          </Collapse>
        )}

        <Flex justify="space-between" align="center" gap="sm" mb="xs">
          <Group gap={6} align="baseline" wrap="nowrap">
            <Text size="xs" fw={600}>
              {t(PRICE_SUMMARY_BAR_TRANSLATIONS.totalLabel)}
            </Text>
            {totalDisplay}
          </Group>

          {hasAnyItems && (
            <ActionIcon
              variant="subtle"
              color="gray"
              size="md"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={t(
                mobileOpen
                  ? PRICE_SUMMARY_BAR_TRANSLATIONS.collapseDetailsAria
                  : PRICE_SUMMARY_BAR_TRANSLATIONS.expandDetailsAria,
              )}
            >
              {mobileOpen ? <IconChevronDown size={20} /> : <IconChevronUp size={20} />}
            </ActionIcon>
          )}
        </Flex>

        <Box mb="xs">{disclaimer}</Box>

        {submitButton}
      </Paper>
    );
  }

  return (
    <>
      <Drawer.Root
        opened={desktopDrawerOpen}
        onClose={() => setDesktopDrawerOpen(false)}
        position="left"
        size="sm"
        styles={{
          inner: { height: '100%', alignItems: 'stretch' },
          content: {
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          },
        }}
      >
        <Drawer.Overlay backgroundOpacity={0.35} blur={1} />
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>
              <Text fw={600}>{t(PRICE_SUMMARY_BAR_TRANSLATIONS.detailsTitle)}</Text>
            </Drawer.Title>
            <Drawer.CloseButton />
          </Drawer.Header>

          <Drawer.Body style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
            {hasAnyItems ? (
              itemsList
            ) : (
              <Text size="sm" c="dimmed">
                {t(PRICE_SUMMARY_BAR_TRANSLATIONS.noSelectionsLabel)}
              </Text>
            )}
          </Drawer.Body>

          <Box
            style={{
              padding: 'var(--mantine-spacing-md)',
              borderTop: '1px solid var(--mantine-color-gray-3)',
              flexShrink: 0,
            }}
          >
            <Group justify="space-between" align="baseline" wrap="nowrap">
              <Text size="sm" fw={600}>
                {t(PRICE_SUMMARY_BAR_TRANSLATIONS.totalLabel)}
              </Text>
              {totalDisplay}
            </Group>
          </Box>
        </Drawer.Content>
      </Drawer.Root>

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
          zIndex: 199,
        }}
      >
        <Flex justify="space-between" align="center" gap="lg">
          <Box style={{ flexShrink: 0 }}>
            {hasAnyItems && (
              <Button
                variant="subtle"
                color="gray"
                size="sm"
                leftSection={<IconListDetails size={16} />}
                onClick={() => setDesktopDrawerOpen(true)}
              >
                {t(PRICE_SUMMARY_BAR_TRANSLATIONS.showDetails)}
              </Button>
            )}
          </Box>

          <Group gap="md" align="center" wrap="nowrap" style={{ flexShrink: 0 }}>
            <Box style={{ maxWidth: 360, textAlign: 'right' }}>
              <Text
                size="xs"
                c="dimmed"
                style={{ whiteSpace: 'pre-line', lineHeight: 1.3, textAlign: 'center' }}
              >
                {t(FORM_PAGE_TRANSLATIONS.submitDisclaimer)}
              </Text>
            </Box>
            <Group gap={6} align="baseline" wrap="nowrap">
              <Text size="sm" fw={600}>
                {t(PRICE_SUMMARY_BAR_TRANSLATIONS.totalLabel)}
              </Text>
              {totalDisplay}
            </Group>
            <Button size="lg" onClick={onSubmit} loading={isSubmitting} disabled={isSubmitting}>
              {t(FORM_PAGE_TRANSLATIONS.submit)}
            </Button>
          </Group>
        </Flex>
      </Paper>
    </>
  );
};

export default PriceSummaryBar;
