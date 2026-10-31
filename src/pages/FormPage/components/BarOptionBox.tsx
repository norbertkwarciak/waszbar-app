import { Box, Button, Group, Image, Paper, Text, Tooltip, ActionIcon } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { COMMON_TRANSLATIONS, FORM_PAGE_TRANSLATIONS } from '@/i18n/tKeys';
import { IconInfoCircle } from '@tabler/icons-react';
import React from 'react';
import { useMediaQuery } from '@mantine/hooks';
import type { BarOption } from '@/core/config/options';

interface BarOptionBoxProps {
  option: BarOption;
  isSelected: boolean;
  onSelect: () => void;
}

export default function BarOptionBox({
  option,
  isSelected,
  onSelect,
}: BarOptionBoxProps): React.JSX.Element {
  const { t } = useTranslation();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const textFontSize = isMobile ? '0.875rem' : '1rem';

  const tooltipText = option.tooltipKey ? t(option.tooltipKey) : null;

  const labelWithInfo = (
    <Group gap={4} justify="center" wrap="nowrap" align="center">
      <Text size="lg" fw={700} style={{ margin: 0, fontSize: textFontSize }}>
        {option.label}
      </Text>
      {tooltipText && (
        <Tooltip
          label={tooltipText}
          multiline
          w={260}
          withArrow
          events={{ hover: true, focus: true, touch: true }}
        >
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            aria-label={tooltipText}
            onClick={(e) => e.stopPropagation()}
          >
            <IconInfoCircle size={18} />
          </ActionIcon>
        </Tooltip>
      )}
    </Group>
  );

  return (
    <Paper
      shadow="md"
      radius="md"
      p="md"
      withBorder
      style={{
        textAlign: 'center',
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        height: '100%',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'var(--mantine-shadow-md)';
      }}
    >
      {!option.image ? (
        <Box
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0 12px',
          }}
        >
          <Text size="md" fw={600} style={{ margin: '48px 0', fontSize: textFontSize }}>
            {option.label}
          </Text>
        </Box>
      ) : (
        <>
          <Image
            component="img"
            data-src={option.image}
            className="lazyload blur-on-load"
            alt={option.label}
            height={300}
            fit="cover"
            radius="md"
            mb="sm"
          />

          <Box
            mb="sm"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 8px',
              textAlign: 'center',
              minHeight: 40,
            }}
          >
            {labelWithInfo}
            {typeof option.price === 'number' && option.price > 0 && (
              <Text size="sm" fw={600} c="dimmed" mt={4}>
                +{option.price} {t(COMMON_TRANSLATIONS.pln)}
              </Text>
            )}
          </Box>
        </>
      )}

      <Button fullWidth variant={isSelected ? 'filled' : 'light'} onClick={onSelect}>
        {t(FORM_PAGE_TRANSLATIONS.select)}
      </Button>
    </Paper>
  );
}
