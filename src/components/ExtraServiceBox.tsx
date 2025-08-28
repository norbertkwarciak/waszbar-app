import { Box, Button, Image, Paper, Stack, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { FORM_PAGE_TRANSLATIONS } from '@/i18n/tKeys';
import React from 'react';

type ExtraService = {
  label: string;
  price: string;
  image: string;
  description: string;
  value: string;
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
      component="button"
      type="button"
      onClick={onOpenModal}
      shadow="md"
      radius="md"
      p="sm"
      withBorder
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        borderColor: isSelected ? '#228be6' : undefined,
        borderWidth: isSelected ? 2 : undefined,
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
          src={service.image}
          alt={service.label}
          height={350}
          fit="cover"
          radius="md"
          style={{ pointerEvents: 'none' }}
        />

        <Box>
          <Text fw={600} size="sm">
            {service.label}
          </Text>
          <Text size="xs" c="dimmed">
            {service.price}
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
          {t(
            isSelected
              ? FORM_PAGE_TRANSLATIONS.selectedService
              : FORM_PAGE_TRANSLATIONS.selectService,
          )}
        </Button>
      </Stack>
    </Paper>
  );
}
