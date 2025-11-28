import { Card, Container, Stack, Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { PRIVACY_POLICY_TRANSLATIONS } from '@/i18n/tKeys';
import { env } from '@/core/config/env';

function PrivacyPolicyPage(): React.JSX.Element {
  const { t } = useTranslation();

  const renderMultiline = (text: string): React.ReactNode[] =>
    text.split('\n').map((line, idx) => (
      <Text key={idx} component="p" mb={5}>
        {line}
      </Text>
    ));

  return (
    <Container size="md" py={20} pb={140}>
      <Title order={2} mb="md">
        {t(PRIVACY_POLICY_TRANSLATIONS.title)}
      </Title>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            {t(PRIVACY_POLICY_TRANSLATIONS.publicationDate)}
          </Text>

          {renderMultiline(t(PRIVACY_POLICY_TRANSLATIONS.intro))}

          <Title order={4}>{t(PRIVACY_POLICY_TRANSLATIONS.section1Title)}</Title>
          {renderMultiline(t(PRIVACY_POLICY_TRANSLATIONS.section1Text, { email: env.ownerEmail }))}

          <Title order={4}>{t(PRIVACY_POLICY_TRANSLATIONS.section2Title)}</Title>
          {renderMultiline(t(PRIVACY_POLICY_TRANSLATIONS.section2Text))}

          <Title order={4}>{t(PRIVACY_POLICY_TRANSLATIONS.section3Title)}</Title>
          {renderMultiline(t(PRIVACY_POLICY_TRANSLATIONS.section3Text))}

          <Title order={4}>{t(PRIVACY_POLICY_TRANSLATIONS.section4Title)}</Title>
          {renderMultiline(t(PRIVACY_POLICY_TRANSLATIONS.section4Text))}

          <Title order={4}>{t(PRIVACY_POLICY_TRANSLATIONS.section5Title)}</Title>
          {renderMultiline(t(PRIVACY_POLICY_TRANSLATIONS.section5Text))}

          <Title order={4}>{t(PRIVACY_POLICY_TRANSLATIONS.section6Title)}</Title>
          {renderMultiline(t(PRIVACY_POLICY_TRANSLATIONS.section6Text, { email: env.ownerEmail }))}

          <Title order={4}>{t(PRIVACY_POLICY_TRANSLATIONS.section7Title)}</Title>
          {renderMultiline(t(PRIVACY_POLICY_TRANSLATIONS.section7Text))}

          <Title order={4}>{t(PRIVACY_POLICY_TRANSLATIONS.section8Title)}</Title>
          {renderMultiline(t(PRIVACY_POLICY_TRANSLATIONS.section8Text, { email: env.ownerEmail }))}
        </Stack>
      </Card>
    </Container>
  );
}

export default PrivacyPolicyPage;
