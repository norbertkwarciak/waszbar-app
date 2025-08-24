import { Button, Container, Image, Paper, Stack, Group } from '@mantine/core';
import { Link } from 'react-router-dom';
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { useTranslation } from 'react-i18next';
import { HOME_PAGE_TRANSLATIONS } from '@/i18n/tKeys';
import imageWedding from '@/assets/FOTO_DRINKBAR_NA_WESELE.jpg';
import imageEvent from '@/assets/FOTO_DRINKBAR_NA_EVENT.jpg';

interface BarCardProps {
  image: string;
  alt: string;
  buttonText: string;
  to: string;
}

const BarCard = ({ image, alt, buttonText, to }: BarCardProps): React.JSX.Element => {
  return (
    <Paper shadow="md" radius="md" p="md" withBorder w={500} ta="center">
      <Stack align="center">
        <Image src={image} alt={alt} height={400} fit="cover" radius="md" />
        <Button component={Link} to={to} size="lg" fullWidth>
          {buttonText}
        </Button>
      </Stack>
    </Paper>
  );
};

const HomePage = (): React.JSX.Element => {
  const { t } = useTranslation();

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
            image={imageWedding}
            alt={t(HOME_PAGE_TRANSLATIONS.weddingImageAlt)}
            buttonText={t(HOME_PAGE_TRANSLATIONS.weddingButton)}
            to="/form/wedding"
          />
          <BarCard
            image={imageEvent}
            alt={t(HOME_PAGE_TRANSLATIONS.eventImageAlt)}
            buttonText={t(HOME_PAGE_TRANSLATIONS.eventButton)}
            to="/form/event"
          />
        </Group>
      </Container>
    </PageLayout>
  );
};

export default HomePage;
