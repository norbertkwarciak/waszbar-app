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
    thumbnail: 'https://waszbar-storage.s3.eu-north-1.amazonaws.com/assets/PAKIET_BASIC.png',
    description: 'formPage.menuPackagesDescriptions.basic',
  },
  {
    label: 'MEDIUM',
    value: MenuPackageType.MEDIUM,
    thumbnail: 'https://waszbar-storage.s3.eu-north-1.amazonaws.com/assets/PAKIET_MEDIUM.png',
    description: 'formPage.menuPackagesDescriptions.medium',
  },
  {
    label: 'MAX',
    value: MenuPackageType.MAX,
    thumbnail: 'https://waszbar-storage.s3.eu-north-1.amazonaws.com/assets/PAKIET_MAX.png',
    description: 'formPage.menuPackagesDescriptions.max',
  },
  {
    label: 'KLASYCZNY',
    value: MenuPackageType.KLASYCZNY,
    thumbnail: 'https://waszbar-storage.s3.eu-north-1.amazonaws.com/assets/PAKIET_KLASYCZNY.png',
    description: 'formPage.menuPackagesDescriptions.classic',
  },
  {
    label: 'EXCELLENT',
    value: MenuPackageType.EXCELLENT,
    thumbnail: 'https://waszbar-storage.s3.eu-north-1.amazonaws.com/assets/PAKIET_EXCELLENT.png',
    description: 'formPage.menuPackagesDescriptions.excellent',
  },
];
