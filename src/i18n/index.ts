import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationPL from './locales/pl/translation.json';

const resources = {
  pl: {
    translation: translationPL,
  },
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'pl',
  interpolation: {
    escapeValue: false,
  },
  detection: {
    order: ['localStorage', 'navigator'],
    caches: ['localStorage'],
  },
});

export default i18n;
