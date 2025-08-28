import { Box, Button, Group, Image, Paper, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { FORM_PAGE_TRANSLATIONS } from '@/i18n/tKeys';
import React from 'react';

type MenuPackage = {
  label: string;
  value: string;
  thumbnail: string;
  description: string;
};

interface MenuPackageBoxProps {
  pkg: MenuPackage;
  isSelected: boolean;
  onSelect: () => void;
  onOpenModal: () => void;
  isFullWidth?: boolean;
}

export default function MenuPackageBox({
  pkg,
  isSelected,
  onSelect,
  onOpenModal,
  isFullWidth = false,
}: MenuPackageBoxProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <Box style={isFullWidth ? { gridColumn: '1 / -1' } : {}}>
      <Paper shadow="md" radius="md" p="sm" withBorder style={{ textAlign: 'center' }}>
        <Image
          src={pkg.thumbnail}
          alt={pkg.label}
          height={120}
          fit="cover"
          radius="md"
          mb="xs"
          style={{ cursor: 'pointer' }}
        />

        <Group justify="space-between" align="start" mb="xs">
          <Text fw={500}>{pkg.label}</Text>

          <Button
            variant="subtle"
            color="gray"
            size="compact-sm"
            px={4}
            ml="auto"
            onClick={onOpenModal}
            aria-label="Show package details"
          >
            <IconInfoCircle size={18} />
          </Button>
        </Group>

        <Button fullWidth variant={isSelected ? 'filled' : 'light'} onClick={onSelect}>
          {t(FORM_PAGE_TRANSLATIONS.chooseMenu)}
        </Button>
      </Paper>
    </Box>
  );
}
