import { Modal, Container, Group, Stack, Text, List } from '@mantine/core';
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { useTranslation } from 'react-i18next';
import { HOME_PAGE_TRANSLATIONS } from '@/i18n/tKeys';
import { IMAGES } from '@/core/config/assets';
import { env } from '@/core/config/env';
import { useDisclosure } from '@mantine/hooks';
import BarCard from '@/components/BarCard';

const HomePage = (): React.JSX.Element => {
  const { t } = useTranslation();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <PageLayout>
      <Container
        size="lg"
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Group justify="center" gap="xl">
          <BarCard
            image={IMAGES.drinkBarWedding}
            alt={t(HOME_PAGE_TRANSLATIONS.weddingImageAlt)}
            buttonText={t(HOME_PAGE_TRANSLATIONS.weddingButton)}
            to="/form/wedding"
          />
          <BarCard
            image={IMAGES.drinkBarEvent}
            alt={t(HOME_PAGE_TRANSLATIONS.eventImageAlt)}
            buttonText={t(HOME_PAGE_TRANSLATIONS.eventButton)}
            onClick={open}
          />
        </Group>
      </Container>

      <Modal
        opened={opened}
        onClose={close}
        title={
          <Text fw={600} size="lg">
            {t(HOME_PAGE_TRANSLATIONS.eventModalTitle)}
          </Text>
        }
        centered
        size="xl"
      >
        <Stack pb="md">
          <Text size="md">
            <a href="mailto:biuro@waszbar.pl" style={{ color: 'var(--mantine-color-blue-filled)' }}>
              {env.ownerEmail}
            </a>
          </Text>

          <Text size="md">{t(HOME_PAGE_TRANSLATIONS.eventModalText)}</Text>

          <List spacing={6} size="sm" withPadding listStyleType="disc">
            <List.Item>{t(HOME_PAGE_TRANSLATIONS.eventModalLocation)}</List.Item>
            <List.Item>{t(HOME_PAGE_TRANSLATIONS.eventModalDate)}</List.Item>
            <List.Item>{t(HOME_PAGE_TRANSLATIONS.eventModalGuests)}</List.Item>
            <List.Item>{t(HOME_PAGE_TRANSLATIONS.eventModalEmail)}</List.Item>
            <List.Item>{t(HOME_PAGE_TRANSLATIONS.eventModalGuidelines)}</List.Item>
          </List>
        </Stack>
      </Modal>
    </PageLayout>
  );
};

export default HomePage;
