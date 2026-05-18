import React from 'react';
import { Container, Stack, Title, Text, Button, Box, Image } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { NOT_FOUND_PAGE_TRANSLATIONS } from '@/i18n/tKeys';
import { IMAGES } from '@/core/config/assets';
import BackgroundImage from '@/components/BackgroundImage';

const NotFoundPage = (): React.JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBackToHome = (): void => {
    navigate('/');
  };

  return (
    <Box
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <BackgroundImage />

      <Container
        size="lg"
        style={{
          textAlign: 'center',
          paddingTop: 40,
          paddingBottom: 40,
        }}
      >
        <Stack align="center" gap="xl">
          <Box>
            <Image
              src={IMAGES.logo}
              alt="Waszbar.pl"
              style={{
                maxWidth: '300px',
                width: '100%',
                height: 'auto',
              }}
            />
          </Box>

          <Stack align="center" gap="md">
            <Title
              order={1}
              style={{
                fontSize: '2rem',
                fontWeight: 700,
              }}
            >
              {t(NOT_FOUND_PAGE_TRANSLATIONS.title)}
            </Title>

            <Text size="lg" c="dimmed">
              {t(NOT_FOUND_PAGE_TRANSLATIONS.description)}
            </Text>
          </Stack>

          <Button
            size="lg"
            onClick={handleBackToHome}
            style={{
              marginTop: '1rem',
            }}
          >
            {t(NOT_FOUND_PAGE_TRANSLATIONS.backToHome)}
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default NotFoundPage;
