import { Title, Image, Modal, Box, Stack, useMantineTheme } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { Carousel } from '@mantine/carousel';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GALLERY_PAGE_TRANSLATIONS } from '@/i18n/tKeys';
import '@mantine/carousel/styles.css';

const IMAGES: string[] = [
  '/Galeria_1.png',
  '/Galeria_2.png',
  '/Galeria_3.png',
  '/Galeria_4.png',
  '/Galeria_5.png',
  '/Galeria_6.png',
  '/Galeria_7.png',
  '/Galeria_8.png',
  '/Galeria_9.png',
  '/Galeria_10.png',
  '/Galeria_11.png',
  '/Galeria_12.png',
  '/Galeria_13.png',
  '/Galeria_14.png',
  '/Galeria_15.png',
  '/Galeria_16.png',
];

function GalleryPage(): React.JSX.Element {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { t } = useTranslation();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const openFullScreen = (src: string): void => {
    setSelectedImage(src);
    open();
  };

  return (
    <Box py="xl">
      <style>
        {`
          .mantine-Carousel-indicator {
            transition: all 150ms ease;
            background-color: rgba(255, 255, 255, 0.4);
          }
          .mantine-Carousel-indicator[data-active] {
            background-color: ${theme.colors.primary[5]};
          }
        `}
      </style>
      <Title order={2} ta="center" mb="xl">
        {t(GALLERY_PAGE_TRANSLATIONS.title)}
      </Title>

      {isMobile ? (
        <Stack gap="md">
          {IMAGES.map((src, index) => (
            <Image
              key={index}
              src={src}
              alt={`Gallery image ${index + 1}`}
              radius="md"
              onClick={() => openFullScreen(src)}
              style={{
                cursor: 'pointer',
                width: '100%',
                objectFit: 'cover',
              }}
            />
          ))}
        </Stack>
      ) : (
        <Carousel
          withIndicators
          withControls
          slideSize={{ base: '100%', sm: '50%', md: '33.333333%' }}
          slideGap={{ base: 0, sm: 'md' }}
          emblaOptions={{ loop: true, align: 'start', slidesToScroll: 1 }}
        >
          {IMAGES.map((src, index) => (
            <Carousel.Slide key={index}>
              <Image
                src={src}
                alt={`Gallery image ${index + 1}`}
                radius="md"
                onClick={() => openFullScreen(src)}
                style={{
                  cursor: 'pointer',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Carousel.Slide>
          ))}
        </Carousel>
      )}

      <Modal opened={opened} onClose={close} size="auto" centered withCloseButton={false}>
        {selectedImage && (
          <Box
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img
              src={selectedImage}
              alt="Full screen"
              style={{
                maxWidth: '100%',
                maxHeight: '85vh',
                objectFit: 'contain',
                borderRadius: '8px',
              }}
            />
          </Box>
        )}
      </Modal>
    </Box>
  );
}

export default GalleryPage;
