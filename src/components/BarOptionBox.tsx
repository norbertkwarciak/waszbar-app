import { Box, Button, Image, Paper, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { FORM_PAGE_TRANSLATIONS } from '@/i18n/tKeys';
import React from 'react';

type BarOption = {
  label: string;
  value: string;
  image: string;
};

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

  return (
    <Paper
      shadow="md"
      radius="md"
      p="md"
      withBorder
      style={{
        textAlign: 'center',
        display: 'flex',
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
          <Text size="md" fw={600} style={{ margin: '24px 0' }}>
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
            h={40}
            mb="sm"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 8px',
              textAlign: 'center',
            }}
          >
            <Text size="lg" fw={700} style={{ margin: 0 }}>
              {option.label}
            </Text>
          </Box>
        </>
      )}

      <Button fullWidth variant={isSelected ? 'filled' : 'light'} onClick={onSelect}>
        {t(FORM_PAGE_TRANSLATIONS.select)}
      </Button>
    </Paper>
  );
}
