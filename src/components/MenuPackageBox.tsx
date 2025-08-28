import { Box, Button, Image, Paper, Stack, Text } from '@mantine/core';
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
      <Paper
        onClick={onOpenModal}
        shadow="md"
        radius="md"
        p="sm"
        withBorder
        style={{
          display: 'block',
          width: '100%',
          textAlign: 'center',
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
        <Stack gap="xs">
          <Image
            src={pkg.thumbnail}
            alt={pkg.label}
            height={120}
            fit="cover"
            radius="md"
            style={{ pointerEvents: 'none' }}
          />

          <Text fw={500}>{pkg.label}</Text>

          <Button
            fullWidth
            variant={isSelected ? 'filled' : 'light'}
            onClick={(e) => {
              e.stopPropagation(); // prevent parent onClick
              onSelect();
            }}
          >
            {t(FORM_PAGE_TRANSLATIONS.chooseMenu)}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
