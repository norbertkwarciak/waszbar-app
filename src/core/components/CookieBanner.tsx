import { Anchor, Button, Group, Paper, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { COOKIES_BAR_TRANSLATIONS } from '@/i18n/tKeys';
import { useTranslation } from 'react-i18next';
import { env } from '@/core/config/env';

const CookieBanner = (): React.JSX.Element | null => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(env.cookiesConsentKey);
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = (): void => {
    localStorage.setItem(env.cookiesConsentKey, 'accepted');
    setVisible(false);
  };

  const handleDecline = (): void => {
    localStorage.setItem(env.cookiesConsentKey, 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <Paper
      shadow="md"
      p="md"
      withBorder
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: 'var(--mantine-color-body)',
      }}
    >
      <Group justify="space-between" wrap="wrap">
        <Text size="sm">
          {t(COOKIES_BAR_TRANSLATIONS.description)}{' '}
          <Anchor component={Link} to="/privacy-policy">
            {t(COOKIES_BAR_TRANSLATIONS.learnMore)}
          </Anchor>
        </Text>

        <Group mt={{ base: 'sm', sm: 0 }}>
          <Button size="xs" variant="default" onClick={handleDecline}>
            {t(COOKIES_BAR_TRANSLATIONS.decline)}
          </Button>
          <Button size="xs" onClick={handleAccept}>
            {t(COOKIES_BAR_TRANSLATIONS.accept)}
          </Button>
        </Group>
      </Group>
    </Paper>
  );
};

export default CookieBanner;
