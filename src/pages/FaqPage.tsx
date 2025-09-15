import { Accordion, Container, Text } from '@mantine/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FAQ_PAGE_TRANSLATIONS } from '@/i18n/tKeys';
import { faqs } from '@/core/config/options';
import PageHeader from '@/components/PageHeader';

const FaqPage = (): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <Container
      size="lg"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        paddingTop: 20,
        paddingBottom: 60,
      }}
    >
      <PageHeader title={t(FAQ_PAGE_TRANSLATIONS.title)} />

      <Accordion
        variant="separated"
        radius="md"
        defaultValue="customization"
        mt="xl"
        style={{ width: '100%' }}
      >
        {faqs.map((faq, index) => (
          <Accordion.Item value={`item-${index}`} key={faq.question}>
            <Accordion.Control>
              <Text fw={700}>{faq.question}</Text>
            </Accordion.Control>
            <Accordion.Panel>{faq.answer}</Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  );
};

export default FaqPage;
