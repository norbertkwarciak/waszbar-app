import { IMAGES } from './assets';
import translationPL from '@/i18n/locales/pl/translation.json';
import { MenuPackageType } from '@/types';

export interface BarOption {
  label: string;
  image: string;
  value: string;
  price?: number;
  tooltipKey?: string;
}

export const barOptions: BarOption[] = [
  {
    label: 'BIAŁY KLASYCZNY WESELNY',
    image: IMAGES.whiteClassicWedding,
    value: 'biały klasyczny weselny',
  },
  {
    label: 'CZARNY GLAMOUR',
    image: IMAGES.blackGlamour,
    value: 'czarny glamour',
  },
  {
    label: 'CZARNY GLAMOUR SZTUKATERIA',
    image: IMAGES.blackGlamourStucco,
    value: 'czarny glamour sztukateria',
  },
  {
    label: 'RUSTYKALNY',
    image: IMAGES.rustic,
    value: 'rustykalny',
  },
  {
    label: 'BIAŁY ANGIELSKI SZTUKATERIA',
    image: IMAGES.whiteEnglishStucco,
    value: 'biały angielski sztukateria',
  },
  {
    label: 'BAR ZŁOTY LUSTRO',
    image: IMAGES.goldMirror,
    value: 'bar złoty lustro',
  },
  {
    label: 'Nie potrzebujemy baru. Na sali będzie bar, z którego będzie można skorzystać.',
    image: '',
    value: 'bez baru',
  },
];

export const outdoorTentOption: BarOption = {
  label: 'BAR PLENEROWY - NAMIOT (4m x 3m)',
  image: IMAGES.outdoorTent,
  value: 'bar plenerowy - namiot (4m x 3m)',
  price: 250,
  tooltipKey: 'formPage.outdoorTentTooltip',
};

export const menuPackages = [
  {
    label: 'BASIC',
    value: MenuPackageType.BASIC,
    thumbnail: '/PAKIET__BASIC.png',
    features: [
      'koktajle na wódce i ginie',
      'drinki 0%',
      'drinki na suchym lodzie',
      'drinki dla dzieci',
    ],
    description: 'formPage.menuPackagesDescriptions.basic',
  },
  {
    label: 'MEDIUM',
    value: MenuPackageType.MEDIUM,
    thumbnail: '/PAKIET__MEDIUM.png',
    features: [
      'koktajle na wódce, ginie, rumie, Jagermeistrze, tequili',
      'drinki 0%',
      'drinki na suchym lodzie',
      'drinki dla dzieci',
    ],
    description: 'formPage.menuPackagesDescriptions.medium',
  },
  {
    label: 'MAX',
    value: MenuPackageType.MAX,
    thumbnail: '/PAKIET__MAX.png',
    features: [
      'koktajle na wódce, whisky, Aperol & prosecco, ginie, rumie, Jagermeistrze, tequili',
      'drinki 0%',
      'drinki na suchym lodzie',
      'drinki dla dzieci',
    ],
    description: 'formPage.menuPackagesDescriptions.max',
  },
  {
    label: 'KLASYCZNY',
    value: MenuPackageType.KLASYCZNY,
    thumbnail: '/PAKIET__KLASYCZNY.png',
    features: [
      'koktajle klasyczne (na wódce, whisky, Aperol & prosecco, ginie, rumie, Jagermeistrze, tequili)',
      'drinki 0%',
      'drinki dla dzieci',
    ],
    description: 'formPage.menuPackagesDescriptions.classic',
  },
  {
    label: 'EXCELLENT',
    value: MenuPackageType.EXCELLENT,
    thumbnail: '/PAKIET__EXCELLENT.png',
    features: [
      'koktajle autorskie',
      'wliczone pakiety (MAX, KLASYCZNY)',
      'drinki 0%',
      'drinki dla dzieci',
      'GRANITA',
    ],
    description: 'formPage.menuPackagesDescriptions.excellent',
  },
  {
    label: 'DEGUSTACYJNY',
    value: MenuPackageType.DEGUSTACYJNY,
    thumbnail: '/PAKIET__DEGUSTACYJNY.png',
    features: ['bar degustacyjny', 'wysoko gatunkowa whisky/burbon', 'koktajle klasyczne'],
    description: 'formPage.menuPackagesDescriptions.tasting',
  },
];

export const faqs = translationPL.faqPage.items.map((_, i) => ({
  question: `faqPage.items.${i}.question`,
  answer: `faqPage.items.${i}.answer`,
}));
