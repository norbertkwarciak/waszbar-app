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
    description: 'formPage.extraServicesDescriptions.smoke',
    value: 'smoke',
  },
  {
    label: 'PAKIET JAGERMEISTER',
    price: '250 PLN',
    image: imageJagermeister,
    description: 'formPage.extraServicesDescriptions.jager',
    value: 'jager',
  },
  {
    label: 'PAKIET JACK DANIEL FIRE',
    price: '250 PLN',
    image: imageJackDaniels,
    description: 'formPage.extraServicesDescriptions.jack',
    value: 'jack',
  },
  {
    label: 'COCKTAILS SUPER COLD – GRANITOR -13°',
    price: '750 PLN',
    image: imageGranitor,
    description: 'formPage.extraServicesDescriptions.granitor',
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
    description: 'formPage.menuPackagesDescriptions.basic',
  },
  {
    label: 'PAKIET MEDIUM',
    value: 'medium',
    thumbnail: 'https://placehold.co/200x120?text=Medium',
    description: 'formPage.menuPackagesDescriptions.medium',
  },
  {
    label: 'PAKIET MAX',
    value: 'max',
    thumbnail: 'https://placehold.co/200x120?text=Max',
    description: 'formPage.menuPackagesDescriptions.max',
  },
  {
    label: 'PAKIET KLASYCZNY',
    value: 'classic',
    thumbnail: 'https://placehold.co/200x120?text=Klasyczny',
    description: 'formPage.menuPackagesDescriptions.classic',
  },
  {
    label: 'PAKIET EXCELLENT',
    value: 'excellent',
    thumbnail: 'https://placehold.co/200x120?text=Excellent',
    description: 'formPage.menuPackagesDescriptions.excellent',
  },
];
