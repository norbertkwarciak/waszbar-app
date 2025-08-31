import React from 'react';
import { Button, Divider, Group, Modal, Text } from '@mantine/core';
import { Trans, useTranslation } from 'react-i18next';
import { FORM_PAGE_TRANSLATIONS } from '@/i18n/tKeys';
import { menuPackages } from '@/core/config/options';
import { env } from '@/core/config/env';

interface Props {
  opened: boolean;
  onClose: () => void;
  modalPackage: (typeof menuPackages)[0] | null;
  numberOfGuests: number | '';
  rangesMap: Record<string, number[]> | null;
  packagePdfUrl: string | null;
  exceedsMaxRange: number | null;
}

export default function MenuPackageModal({
  opened,
  onClose,
  modalPackage,
  packagePdfUrl,
  exceedsMaxRange,
}: Props): React.JSX.Element {
  const { t } = useTranslation();

  if (!modalPackage) return <></>;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text fw="bold" size="lg">
          {t(modalPackage.label)}
        </Text>
      }
      centered
      size="xl"
    >
      <Text size="sm" mb="sm">
        {t(modalPackage.description)}
      </Text>

      {exceedsMaxRange ? (
        <>
          <Divider mb="md" />
          <Text size="sm" fw="bold">
            <Trans
              i18nKey={FORM_PAGE_TRANSLATIONS.guestsExceedRangeMessage}
              values={{
                menuPackage: t(modalPackage.value).toUpperCase(),
                maxGuests: exceedsMaxRange,
                email: env.ownerEmail,
              }}
              components={{
                1: <Text span c="blue.6" inherit fw={700} key="email" />,
              }}
            />
          </Text>
        </>
      ) : packagePdfUrl ? (
        <>
          <iframe
            src={packagePdfUrl}
            style={{ width: '100%', height: '60vh', border: 'none' }}
            title="Oferta PDF"
          />
          <Group mt="sm" justify="flex-end">
            <Button component="a" href={packagePdfUrl} target="_blank" rel="noopener noreferrer">
              {t(FORM_PAGE_TRANSLATIONS.openInNewTab)}
            </Button>
          </Group>
        </>
      ) : null}
    </Modal>
  );
}
