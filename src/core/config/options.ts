import { IMAGES } from './assets';
import { MenuPackageType } from '@/types';

export const barOptions = [
  {
    label: 'BIAŁY KLASYCZNY WESELNY',
    image: IMAGES.whiteClassicWedding,
    value: 'white-classic',
  },
  {
    label: 'CZARNY GLAMOUR',
    image: IMAGES.blackGlamour,
    value: 'black-glamour',
  },
  {
    label: 'RUSTYKALNY',
    image: IMAGES.rustic,
    value: 'rustic',
  },
];

export const menuPackages = [
  {
    label: 'BASIC',
    value: MenuPackageType.BASIC,
    thumbnail: 'https://waszbar-storage.s3.eu-north-1.amazonaws.com/assets/Pakiet_BASIC.jpg',
    description: 'formPage.menuPackagesDescriptions.basic',
  },
  {
    label: 'MEDIUM',
    value: MenuPackageType.MEDIUM,
    thumbnail: 'https://waszbar-storage.s3.eu-north-1.amazonaws.com/assets/Pakiet_MEDIUM.jpg',
    description: 'formPage.menuPackagesDescriptions.medium',
  },
  {
    label: 'MAX',
    value: MenuPackageType.MAX,
    thumbnail: 'https://waszbar-storage.s3.eu-north-1.amazonaws.com/assets/Pakiet_MAX.jpg',
    description: 'formPage.menuPackagesDescriptions.max',
  },
  {
    label: 'KLASYCZNY',
    value: MenuPackageType.KLASYCZNY,
    thumbnail: 'https://waszbar-storage.s3.eu-north-1.amazonaws.com/assets/Pakiet_KLASYCZNY.jpg',
    description: 'formPage.menuPackagesDescriptions.classic',
  },
  {
    label: 'EXCELLENT',
    value: MenuPackageType.EXCELLENT,
    thumbnail: 'https://waszbar-storage.s3.eu-north-1.amazonaws.com/assets/Pakiet_EXCELLENT.jpg',
    description: 'formPage.menuPackagesDescriptions.excellent',
  },
];
