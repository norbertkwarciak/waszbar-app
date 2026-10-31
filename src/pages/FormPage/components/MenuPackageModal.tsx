import React, { useState, useEffect } from 'react';
import {
  Button,
  Divider,
  Group,
  Modal,
  Text,
  Box,
  Alert,
  Center,
  Loader,
  Stack,
} from '@mantine/core';
import { Trans, useTranslation } from 'react-i18next';
import { FORM_PAGE_TRANSLATIONS } from '@/i18n/tKeys';
import { menuPackages } from '@/core/config/options';
import { env } from '@/core/config/env';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import '@cyntler/react-doc-viewer/dist/index.css';
import { IconAlertCircle } from '@tabler/icons-react';

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
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!packagePdfUrl) return;
    setIsLoading(true);
    setIsError(false);

    fetch(packagePdfUrl, { method: 'HEAD' })
      .then((res) => {
        if (!res.ok) throw new Error('Not OK');
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
      });
  }, [packagePdfUrl]);

  if (!modalPackage) return <></>;

  const renderDocViewer = (): React.JSX.Element => {
    if (isLoading) {
      return (
        <Center h="100%" style={{ minHeight: '60vh' }}>
          <Stack align="center" gap="sm">
            <Loader size="lg" />
            <Text c="dimmed" size="sm">
              {t(FORM_PAGE_TRANSLATIONS.loadingDocument)}
            </Text>
          </Stack>
        </Center>
      );
    }

    if (isError || !packagePdfUrl) {
      return (
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title={t(FORM_PAGE_TRANSLATIONS.failedToLoadDocumentError)}
          color="red"
          variant="light"
        >
          {t(FORM_PAGE_TRANSLATIONS.failedToLoadDocumentMessage)}
        </Alert>
      );
    }

    try {
      return (
        <DocViewer
          documents={[{ uri: packagePdfUrl }]}
          pluginRenderers={DocViewerRenderers}
          config={{
            header: {
              disableHeader: true,
              disableFileName: true,
              retainURLParams: false,
            },
            pdfVerticalScrollByDefault: true,
            pdfZoom: {
              defaultZoom: 1.0,
              zoomJump: 0.2,
            },
          }}
          style={{ width: '100%', height: '100%' }}
        />
      );
    } catch {
      return (
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title={t(FORM_PAGE_TRANSLATIONS.failedToLoadDocumentError)}
          color="red"
          variant="light"
        >
          {t(FORM_PAGE_TRANSLATIONS.unsupportedFileType)}
        </Alert>
      );
    }
  };

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
      ) : (
        <>
          <Box style={{ width: '100%' }}>{renderDocViewer()}</Box>
          {packagePdfUrl && !isError && (
            <Group mt="sm" justify="flex-end">
              <Button component="a" href={packagePdfUrl} target="_blank" rel="noopener noreferrer">
                {t(FORM_PAGE_TRANSLATIONS.openInNewTab)}
              </Button>
            </Group>
          )}
        </>
      )}
    </Modal>
  );
}
