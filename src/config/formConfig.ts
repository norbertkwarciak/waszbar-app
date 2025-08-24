import imageWhiteClassicWedding from '@/assets/FOTO_BAR_BIAŁY_KLASYCZNY_WESELNY.jpg';
import imageBlackGlamour from '@/assets/FOTO_BAR_CZARNY_GLAMOUR.jpeg';
import imageRustic from '@/assets/FOTO_BAR_RUSTYKALNY.jpg';
import imageClouds from '@/assets/FOTO_TANIEC_W_CHMURACH.png';
import imageJagermeister from '@/assets/FOTO_JAGERMEISTER_TAP.jpg';
import imageJackDaniels from '@/assets/FOTO_JACK_DANIELS_TAP.jpeg';
import imageGranitor from '@/assets/FOTO_GRANITOR.png';

export const extraServices = [
  {
    label: 'CIĘŻKI DYM NA PIERWSZY TANIEC',
    price: '450 PLN',
    image: imageClouds,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin bibendum commodo elit.',
    value: 'smoke',
  },
  {
    label: 'PAKIET JAGERMEISTER',
    price: '250 PLN',
    image: imageJagermeister,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae.',
    value: 'jager',
  },
  {
    label: 'PAKIET JACK DANIEL FIRE',
    price: '250 PLN',
    image: imageJackDaniels,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean tempus sapien in elit.',
    value: 'jack',
  },
  {
    label: 'COCKTAILS SUPER COLD – GRANITOR -13°',
    price: '450 PLN',
    image: imageGranitor,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque cursus est vel ex efficitur.',
    value: 'granitor',
  },
];

export const barOptions = [
  {
    label: 'BIAŁY KLASYCZNY WESELNY',
    image: imageWhiteClassicWedding,
    value: 'white-classic',
  },
  {
    label: 'CZARNY GLAMOUR',
    image: imageBlackGlamour,
    value: 'black-glamour',
  },
  {
    label: 'RUSTYKALNY',
    image: imageRustic,
    value: 'rustic',
  },
];

export const menuPackages = [
  {
    label: 'PAKIET BASIC',
    value: 'basic',
    thumbnail: 'https://placehold.co/200x120?text=Basic',
    pdfUrl: '/pdfs/basic.pdf',
  },
  {
    label: 'PAKIET MEDIUM',
    value: 'medium',
    thumbnail: 'https://placehold.co/200x120?text=Medium',
    pdfUrl: '/pdfs/medium.pdf',
  },
  {
    label: 'PAKIET MAX',
    value: 'max',
    thumbnail: 'https://placehold.co/200x120?text=Max',
    pdfUrl: '/pdfs/max.pdf',
  },
  {
    label: 'PAKIET KLASYCZNY',
    value: 'classic',
    thumbnail: 'https://placehold.co/200x120?text=Klasyczny',
    pdfUrl: '/pdfs/classic.pdf',
  },
];

export const guestRanges = [100, 120, 150, 180, 200, 250, 300, 400];
