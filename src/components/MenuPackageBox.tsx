import { Box, Button, Image, List, Paper, Stack, Text } from '@mantine/core';
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
        p="md"
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
        <Stack gap="md">
          <Image
            component="img"
            data-src={pkg.thumbnail}
            className="lazyload blur-on-load"
            alt={pkg.label}
            height={300}
            fit="cover"
            radius="md"
            style={{ pointerEvents: 'none' }}
          />

          <Text size="xl" pt="xs" fw={700}>
            {pkg.label}
          </Text>

          <List
            size="sm"
            spacing="xs"
            center
            style={{
              textAlign: 'center',
              minHeight: 120,
              listStyleType: 'none',
            }}
            px="md"
          >
            {pkg.features.map((feature) => (
              <List.Item key={feature} style={{ justifyContent: 'center', lineHeight: 1.3 }}>
                {feature}
              </List.Item>
            ))}
          </List>

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
