import { IMAGES } from './assets';
import { MenuPackageType } from '@/types';

export const barOptions = [
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
    label: 'RUSTYKALNY',
    image: IMAGES.rustic,
    value: 'rustykalny',
  },
  {
    label: 'Nie potrzebujemy baru. Na sali będzie bar, z którego będzie można skorzystać.',
    image: '',
    value: 'bez baru',
  },
];

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

export const faqs = [
  {
    question: 'Ilu barmanów obsługuje wesele?',
    answer: 'Do 80 gości 1 barman, powyżej 80 gości 2 barmanów.',
  },
  {
    question: 'Skąd jest Waszbar.pl i na jakim obszarze pracuje?',
    answer: 'Jesteśmy z Warszawy. Pracujemy w całej Polsce.',
  },
  { question: 'Czy wystawiacie FV?', answer: 'Tak. Oczywiście.' },
  {
    question: 'Czy macie swoje stanowiska barmańskie i szkło?',
    answer: 'Tak, zapewniamy kompleksowe wyposażenie.',
  },
  {
    question: 'Czy robicie drinki bezalkoholowe?',
    answer: 'Tak. W każdym pakiecie serwujemy drink 0% na życzenie gości.',
  },
  {
    question: 'Ile godzin pracuje bar na przyjęciu?',
    answer: '7h, maksymalnie do 1:00.',
  },
  {
    question: 'Jak liczycie czas pracy baru?',
    answer: 'Od wejścia pary młodej na sale.',
  },
  {
    question: 'Czy można przedłużyć czas pracy baru?',
    answer:
      'Tak. Każda kolejna godzina to koszt: 550pln jeżeli para młoda decyduje się na przyjęciu, 350pln jeżeli para młoda kupuje przedłużenie przy podpisaniu umowy.',
  },
  {
    question: 'Ile maksymalnie może pracować bar na weselu?',
    answer: 'Do 5:00 rano.',
  },
  {
    question: 'Jak podpisujemy umowę?',
    answer:
      'Zdalnie/mailowo poprzez przesłanie sobie wzajemnie podpisanych, zeskanowanych dokumentów umowy.',
  },
  {
    question: 'Czy możemy umówić się na spotkanie, aby podpisać umowę?',
    answer: 'Tak, oczywiście. W Warszawie.',
  },
  { question: 'Czy pobieracie zaliczkę/zadatek?', answer: 'Nie pobieramy.' },
  {
    question: 'Czy robicie drinki dla dzieci?',
    answer: 'Tak, tylko dzieci obsługujemy w drugiej kolejności.',
  },
  {
    question: 'Czy obsługujecie wesela i imprezy w tygodniu?',
    answer: 'Tak. Pracujemy 7 dni w tygodniu.',
  },
  {
    question: 'Ile kosztuje obsługa poprawin?',
    answer:
      'Obsługa poprawin to 70% ceny drinkbaru na wesele, jeżeli obsługiwaliśmy Państwa wesele. Jeżeli szukają Państwo drink baru na samo wesele, liczymy standardową ofertę.',
  },
  {
    question: 'Czy trzeba zapewnić Wam zmywanie i zbieranie szkła barowego?',
    answer:
      'Prosimy tylko o zapewnienie zmywania szkła przez sale. Sami zbieramy swoje szkło, zanosimy i odnosimy na bar ze zmywaka.',
  },
  {
    question: 'Czy potrzebujecie noclegu?',
    answer:
      'Prosimy o zapewnienie noclegu, jeżeli miejsce wesela jest oddalone od Warszawy więcej niż 200 km.',
  },
  { question: 'Czy wymagacie zapewnienia posiłków dla barmanów?', answer: 'Tak. Poprosimy.' },
];
