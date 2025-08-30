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
    label: 'PAKIET BASIC',
    value: MenuPackageType.BASIC,
    thumbnail: 'https://placehold.co/200x120?text=Basic',
    description: 'formPage.menuPackagesDescriptions.basic',
  },
  {
    label: 'PAKIET MEDIUM',
    value: MenuPackageType.MEDIUM,
    thumbnail: 'https://placehold.co/200x120?text=Medium',
    description: 'formPage.menuPackagesDescriptions.medium',
  },
  {
    label: 'PAKIET MAX',
    value: MenuPackageType.MAX,
    thumbnail: 'https://placehold.co/200x120?text=Max',
    description: 'formPage.menuPackagesDescriptions.max',
  },
  {
    label: 'PAKIET KLASYCZNY',
    value: MenuPackageType.KLASYCZNY,
    thumbnail: 'https://placehold.co/200x120?text=Klasyczny',
    description: 'formPage.menuPackagesDescriptions.classic',
  },
  {
    label: 'PAKIET EXCELLENT',
    value: MenuPackageType.EXCELLENT,
    thumbnail: 'https://placehold.co/200x120?text=Excellent',
    description: 'formPage.menuPackagesDescriptions.excellent',
  },
];
