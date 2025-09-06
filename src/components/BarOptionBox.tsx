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
    <Paper shadow="md" radius="md" p="sm" withBorder style={{ textAlign: 'center' }}>
      <Image src={option.image} alt={option.label} height={250} fit="cover" radius="md" mb="sm" />
      <Box
        h="100px"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text size="xl" fw={700}>
          {option.label}
        </Text>
      </Box>
      <Button fullWidth variant={isSelected ? 'filled' : 'light'} onClick={onSelect}>
        {t(FORM_PAGE_TRANSLATIONS.select)}
      </Button>
    </Paper>
  );
}
