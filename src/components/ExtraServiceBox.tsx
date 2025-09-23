import { Box, Button, Image, Paper, Stack, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { FORM_PAGE_TRANSLATIONS } from '@/i18n/tKeys';
import React from 'react';
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
  onToggle: () => void;
  onOpenModal: () => void;
}

export default function ExtraServiceBox({
  service,
  isSelected,
  onToggle,
  onOpenModal,
}: ExtraServiceBoxProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <Paper
      onClick={onOpenModal}
      shadow="md"
      radius="md"
      p="md"
      withBorder
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
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

        <Box>
          <Text fw={600} size="lg">
            {service.label}
          </Text>
          <Text size="xs" c="dimmed">
            {service.price} PLN
          </Text>
        </Box>

        <Button
          fullWidth
          variant={isSelected ? 'filled' : 'light'}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          mt="auto"
        >
          {t(FORM_PAGE_TRANSLATIONS.selectService)}
        </Button>
      </Stack>
    </Paper>
  );
}
