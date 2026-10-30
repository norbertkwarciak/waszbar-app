import { env } from '@/core/config/env';

export const getImageUrl = (fileName: string): string =>
  `${env.public.assets}/${fileName.split('/').map(encodeURIComponent).join('/')}`;

export const IMAGES = {
  drinkBarWedding: getImageUrl('FOTO_DRINKBAR_NA_WESELE.jpg'),
  drinkBarEvent: getImageUrl('FOTO_DRINKBAR_NA_EVENT.jpeg'),
  drinkBarParty: getImageUrl('FOTO_DRINKBAR_NA_IMPREZE.jpg'),
  whiteClassicWedding: getImageUrl('FOTO_BAR_BIAŁY_KLASYCZNY_WESELNY.jpg'),
  blackGlamour: getImageUrl('FOTO_BAR_CZARNY_GLAMOUR.jpeg'),
  blackGlamourStucco: getImageUrl('FOTO_BAR_CZARNY_GLAMOUR_SZTUKATERIA.jpg'),
  rustic: getImageUrl('FOTO_BAR_RUSTYKALNY.jpg'),
  whiteEnglishStucco: getImageUrl('FOTO_BAR_BIAŁY_ANGIELSKI_SZTUKATERIA.jpeg'),
  goldMirror: getImageUrl('FOTO_BAR_ZŁOTY_LUSTRO.jpg'),
  outdoorTent: getImageUrl('FOTO_BAR_PLENEROWY_NAMIOT.png'),
  smoke: getImageUrl('FOTO_TANIEC_W_CHMURACH.png'),
  hoshizaki: getImageUrl('FOTO_HOSHIZAKI_ICE.png'),
  jager: getImageUrl('FOTO_JAGERMEISTER_TAP.jpg'),
  jack: getImageUrl('FOTO_JACK_DANIELS_TAP.jpeg'),
  granitor: getImageUrl('FOTO_GRANITOR.png'),
  logo: getImageUrl('logo.png'),
};
