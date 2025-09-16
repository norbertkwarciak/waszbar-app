import { Title, Image, Modal, Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Carousel } from '@mantine/carousel';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GALLERY_PAGE_TRANSLATIONS } from '@/i18n/tKeys';

const IMAGES: string[] = [
  '/assets/Waszbar_drinkbar_1.jpeg',
  '/assets/Waszbar_drinkbar_2.jpg',
  '/assets/Waszbar_drinkbar_3.jpg',
  '/assets/Waszbar_drinkbar_4.jpeg',
  '/assets/Waszbar_drinkbar_5.jpg',
  '/assets/Waszbar_drinkbar_6.jpg',
  '/assets/Waszbar_drinkbar_7.jpg',
  '/assets/Waszbar_drinkbar_8.jpeg',
  '/assets/Waszbar_drinkbar_9.jpg',
  '/assets/Waszbar_drinkbar_10.jpg',
];

function GalleryPage(): React.JSX.Element {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { t } = useTranslation();

  const openFullScreen = (src: string): void => {
    setSelectedImage(src);
    open();
  };

  return (
    <Box py="xl">
      <Title order={2} ta="center" mb="xl">
        {t(GALLERY_PAGE_TRANSLATIONS.title)}
      </Title>

      <Carousel
        withIndicators
        withControls
        slideSize={{ base: '100%', sm: '50%', md: '33.333333%' }}
        slideGap={{ base: 0, sm: 'md' }}
        emblaOptions={{ loop: true, align: 'start', slidesToScroll: 1 }}
        styles={{
          indicator: {
            backgroundColor: 'gray',
            '&[dataActive]': {
              backgroundColor: 'var(--mantine-color-primary-filled)',
            },
          },
        }}
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
