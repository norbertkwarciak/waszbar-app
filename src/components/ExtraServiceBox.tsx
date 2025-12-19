import { Box, Button, Image, NumberInput, Paper, Stack, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { COMMON, EXTRA_SERVICE_BOX_TRANSLATIONS, FORM_PAGE_TRANSLATIONS } from '@/i18n/tKeys';
import React, { useState, useEffect } from 'react';
import { IMAGES } from '@/core/config/assets';

type ExtraService = {
  price: number;
  label: string;
  id: string;
  description: string;
};

interface ExtraServiceBoxProps {
  service: ExtraService;
  isSelected: boolean;
  onToggle: (count?: number) => void;
  hasCalculator?: boolean;
  initialCount?: number;
}

export default function ExtraServiceBox({
  service,
  isSelected,
  onToggle,
  hasCalculator = false,
  initialCount = 0,
}: ExtraServiceBoxProps): React.JSX.Element {
  const { t } = useTranslation();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [count, setCount] = useState<number>(initialCount);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  const handleCountChange = (value: number | string): void => {
    const newCount = Number(value) || 0;
    setCount(newCount);
    onToggle(newCount);
  };

  const handleToggle = (): void => {
    if (hasCalculator) {
      onToggle(count);
    } else {
      onToggle();
    }
  };

  return (
    <Paper
      shadow="md"
      radius="md"
      p="md"
      withBorder
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
      }}
    >
      <Stack gap="xs" style={{ height: '100%' }}>
        <Image
          component="img"
          data-src={IMAGES[service.id as keyof typeof IMAGES] ?? IMAGES.logo}
          className="lazyload blur-on-load"
          alt={service.label}
          height={300}
          fit="cover"
          radius="md"
          style={{ pointerEvents: 'none' }}
        />

        <Box
          style={{
            minHeight: isDesktop ? 200 : undefined,
          }}
        >
          <Text fw={600} size="lg">
            {service.label}
          </Text>
          <Text size="xs" c="dimmed">
            {hasCalculator ? (
              <>
                1 {t(EXTRA_SERVICE_BOX_TRANSLATIONS.bag)} = {service.price} {t(COMMON.pln)}
              </>
            ) : (
              <>
                {service.price} {t(COMMON.pln)}
              </>
            )}
          </Text>
          <Text size="sm" mt="xs">
            {service.description}
          </Text>
        </Box>

        {hasCalculator ? (
          <NumberInput
            label={t(EXTRA_SERVICE_BOX_TRANSLATIONS.bagCount)}
            value={count}
            onChange={handleCountChange}
            min={0}
            step={1}
            allowDecimal={false}
            allowNegative={false}
            placeholder="0"
            mt="auto"
          />
        ) : (
          <Button
            fullWidth
            variant={isSelected ? 'filled' : 'light'}
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
            mt="auto"
          >
            {t(FORM_PAGE_TRANSLATIONS.selectService)}
          </Button>
        )}
      </Stack>
    </Paper>
  );
}
