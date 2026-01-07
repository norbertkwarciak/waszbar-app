import { Container, Group, Stack, Text, Title, Box } from '@mantine/core';
import React from 'react';
import { useMediaQuery, useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { HOME_PAGE_TRANSLATIONS } from '@/i18n/tKeys';
import { IMAGES } from '@/core/config/assets';
import BarCard from '@/components/BarCard';
import InfoModal, { ModalContent } from '@/components/InfoModal';

interface BarCardConfig {
  image: string;
  altKey: string;
  buttonKey: string;
  to?: string;
  onClick?: () => void;
}

const HomePage = (): React.JSX.Element => {
  const { t } = useTranslation();
  const [eventsOpened, { open: openEvents, close: closeEvents }] = useDisclosure(false);
  const [occasionalEventsOpened, { open: openOccasionalEvents, close: closeOccasionalEvents }] =
    useDisclosure(false);

  const isMobile = useMediaQuery('(max-width: 768px)');

  const barCards: BarCardConfig[] = [
    {
      image: IMAGES.drinkBarWedding,
      altKey: HOME_PAGE_TRANSLATIONS.weddingImageAlt,
      buttonKey: HOME_PAGE_TRANSLATIONS.weddingButton,
      to: '/form/wedding',
    },
    {
      image: IMAGES.drinkBarEvent,
      altKey: HOME_PAGE_TRANSLATIONS.eventImageAlt,
      buttonKey: HOME_PAGE_TRANSLATIONS.eventButton,
      onClick: openEvents,
    },
    {
      image: IMAGES.drinkBarParty,
      altKey: HOME_PAGE_TRANSLATIONS.occasionalEventsImageAlt,
      buttonKey: HOME_PAGE_TRANSLATIONS.occasionalEventsButton,
      onClick: openOccasionalEvents,
    },
  ];

  const eventsModalContent: ModalContent = {
    textBefore: [HOME_PAGE_TRANSLATIONS.eventModalText],
    listItems: [
      HOME_PAGE_TRANSLATIONS.eventModalLocation,
      HOME_PAGE_TRANSLATIONS.eventModalDate,
      HOME_PAGE_TRANSLATIONS.eventModalGuests,
      HOME_PAGE_TRANSLATIONS.eventModalEmail,
      HOME_PAGE_TRANSLATIONS.eventModalGuidelines,
    ],
  };

  const occasionalEventsModalContent: ModalContent = {
    textBefore: [HOME_PAGE_TRANSLATIONS.occasionalEventsModalText],
    subtitle: HOME_PAGE_TRANSLATIONS.occasionalEventsModalSubtitle,
    listItems: [
      HOME_PAGE_TRANSLATIONS.occasionalEventsModalBirthdays,
      HOME_PAGE_TRANSLATIONS.occasionalEventsModal18th,
      HOME_PAGE_TRANSLATIONS.occasionalEventsModalAnniversaries,
      HOME_PAGE_TRANSLATIONS.occasionalEventsModalBaptisms,
      HOME_PAGE_TRANSLATIONS.occasionalEventsModalHouseParties,
    ],
  };

  return (
    <>
      <Container
        size="lg"
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          textAlign: 'center',
          paddingTop: 20,
          paddingBottom: 20,
          paddingLeft: isMobile ? 0 : 16,
          paddingRight: isMobile ? 0 : 16,
        }}
      >
        <Box
          style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
        >
          <Stack mb="xl" gap="xs">
            <Title
              order={2}
              style={{
                fontSize: 60,
                fontFamily: 'var(--font-secondary)',
              }}
            >
              {t(HOME_PAGE_TRANSLATIONS.introText)}
            </Title>
            <Text size="md" style={{ whiteSpace: 'pre-line' }}>
              {t(HOME_PAGE_TRANSLATIONS.descriptionText)}
            </Text>
          </Stack>

          <Group
            justify="center"
            gap={isMobile ? 'md' : 'xl'}
            style={{ flexWrap: isMobile ? 'wrap' : 'nowrap' }}
          >
            {barCards.map((card, idx) => (
              <BarCard
                key={idx}
                image={card.image}
                alt={t(card.altKey)}
                buttonText={t(card.buttonKey)}
                to={card.to}
                onClick={card.onClick}
              />
            ))}
          </Group>
        </Box>
      </Container>

      <InfoModal
        opened={eventsOpened}
        onClose={closeEvents}
        titleKey={HOME_PAGE_TRANSLATIONS.eventModalTitle}
        content={eventsModalContent}
        emailFirst
      />

      <InfoModal
        opened={occasionalEventsOpened}
        onClose={closeOccasionalEvents}
        titleKey={HOME_PAGE_TRANSLATIONS.occasionalEventsModalTitle}
        content={occasionalEventsModalContent}
      />
    </>
  );
};

export default HomePage;
