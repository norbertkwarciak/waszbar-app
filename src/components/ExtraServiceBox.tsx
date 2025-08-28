import { Box, Button, Group, Image, Paper, Stack, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
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
      shadow="md"
      radius="md"
      p="sm"
      withBorder
      style={{
        borderColor: isSelected ? '#228be6' : undefined,
        borderWidth: isSelected ? 2 : undefined,
      }}
    >
      <Stack gap="xs" style={{ height: '100%' }}>
        <Image src={service.image} alt={service.label} height={350} fit="cover" radius="md" />

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
            onClick={onOpenModal}
          >
            <IconInfoCircle size={18} />
          </Button>
        </Group>

        <Button fullWidth variant={isSelected ? 'filled' : 'light'} onClick={onToggle} mt="auto">
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
