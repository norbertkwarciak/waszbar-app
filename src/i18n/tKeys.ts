import { createTranslationKeys } from './utils';

export interface PageTranslations {
  homePage: {
    weddingButton: string;
    eventButton: string;
    weddingImageAlt: string;
    eventImageAlt: string;
  };
  formPage: {
    backToHome: string;
    title: string;
    checkDateLabel: string;
    loadingAvailability: string;
    checkingAvailability: string;
    dateUnavailable: string;
    barSelectionTitle: string;
    select: string;
    skipBar: string;
    locationLabel: string;
    locationPlaceholder: string;
    guestsLabel: string;
    guestsPlaceholder: string;
    guestRangeText: string;
    menuSelectionTitle: string;
    chooseMenu: string;
    additionalServicesTitle: string;
    selectService: string;
    selectedService: string;
    additionalInfoLabel: string;
    additionalInfoPlaceholder: string;
    submit: string;
    submitSuccessTitle: string;
    submitSuccessMsg: string;
    submitErrorTitle: string;
    submitErrorMsg: string;
    availabilityErrorTitle: string;
    availabilityErrorMsg: string;
  };
}

// Type-safe keys for `homePage`
export const HOME_PAGE_TRANSLATIONS =
  createTranslationKeys<PageTranslations['homePage']>('homePage');

// Type-safe keys for `formPage`
export const FORM_PAGE_TRANSLATIONS =
  createTranslationKeys<PageTranslations['formPage']>('formPage');
