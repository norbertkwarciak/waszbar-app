import { Box, Button, Image, Paper, Stack, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { FORM_PAGE_TRANSLATIONS } from '@/i18n/tKeys';
import React from 'react';
import type { MenuPackage } from '@/types';

interface MenuPackageBoxProps {
  pkg: MenuPackage;
  isSelected: boolean;
  onSelect: () => void;
  onOpenModal: () => void;
  center?: boolean;
}

export default function MenuPackageBox({
  pkg,
  isSelected,
  onSelect,
  onOpenModal,
  center = false,
}: MenuPackageBoxProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <Box
      style={
        center
          ? {
              display: 'flex',
              justifyContent: 'center',
            }
          : undefined
      }
    >
      <Paper
        onClick={onOpenModal}
        shadow="md"
        radius="md"
        p="lg"
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
            height={340}
            fit="cover"
            radius="md"
            style={{ pointerEvents: 'none' }}
          />

          <Text size="xl" py="sm" fw={700}>
            {pkg.label}
          </Text>

          <Button
            fullWidth
            variant={isSelected ? 'filled' : 'light'}
            onClick={(e) => {
              e.stopPropagation();
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
