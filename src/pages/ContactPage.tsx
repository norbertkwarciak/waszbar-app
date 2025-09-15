import { Container, Title, Text, Stack, Anchor, Card } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { CONTACT_PAGE_TRANSLATIONS } from '@/i18n/tKeys';

function ContactPage(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <Container size="md" py={20}>
      <Title order={2} mb="md">
        {t(CONTACT_PAGE_TRANSLATIONS.title)}
      </Title>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="xs">
          <Text fw={500} mb="xl">
            {t(CONTACT_PAGE_TRANSLATIONS.mainText)}
          </Text>

          <Text>
            <Anchor href="https://www.waszbar.pl" target="_blank" rel="noopener noreferrer">
              {t(CONTACT_PAGE_TRANSLATIONS.website)}
            </Anchor>
          </Text>

          <Text>
            <Anchor href="mailto:biuro@waszbar.pl">{t(CONTACT_PAGE_TRANSLATIONS.email)}</Anchor>
          </Text>

          <Text>
            <Anchor href="tel:698836034">{t(CONTACT_PAGE_TRANSLATIONS.phone)}</Anchor>
          </Text>

          <Text>
            <Anchor
              href="https://www.facebook.com/barmani.eventy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t(CONTACT_PAGE_TRANSLATIONS.fbLink)}
            </Anchor>
          </Text>

          <Text size="sm" mt="xl">
            {t(CONTACT_PAGE_TRANSLATIONS.slogan)}
          </Text>

          <Text size="sm" mt="xs" style={{ whiteSpace: 'pre-line' }}>
            {t(CONTACT_PAGE_TRANSLATIONS.signature)}
          </Text>
        </Stack>
      </Card>
    </Container>
  );
}

export default ContactPage;
