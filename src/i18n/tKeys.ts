import { createTranslationKeys } from './utils';

export interface PageTranslations {
  homePage: {
    introText: string;
    descriptionText: string;
    weddingButton: string;
    eventButton: string;
    weddingImageAlt: string;
    eventImageAlt: string;
    eventModalTitle: string;
    eventModalText: string;
    eventModalLocation: string;
    eventModalDate: string;
    eventModalGuests: string;
    eventModalEmail: string;
    eventModalGuidelines: string;
    faqLink: string;
  };
  formPage: {
    title: string;
    checkDateLabel: string;
    loadingAvailability: string;
    checkingAvailability: string;
    dateUnavailable: string;
    barSelectionTitle: string;
    select: string;
    skipBar: string;
    noBar: string;
    locationLabel: string;
    locationInputLabel: string;
    locationValidationRequired: string;
    locationPlaceholder: string;
    guestsLabel: string;
    guestsPlaceholder: string;
    menuSelectionTitle: string;
    chooseMenu: string;
    additionalServicesTitle: string;
    selectService: string;
    additionalInfoLabel: string;
    additionalInfoPlaceholder: string;
    contactTitle: string;
    nameLabel: string;
    nameValidationRequired: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    emailValidationRequired: string;
    emailValidationInvalid: string;
    phoneLabel: string;
    phonePlaceholder: string;
    phoneValidationRequired: string;
    phoneValidationInvalid: string;
    phoneValidationLength: string;
    submit: string;
    submitSuccessTitle: string;
    submitSuccessMsg: string;
    submitErrorTitle: string;
    submitErrorMsg: string;
    dataFetchErrorTitle: string;
    dataFetchErrorMsg: string;
    openInNewTab: string;
    guestsExceedRangeMessage: string;
    fieldValidationMessageLabel: {
      selectedBar: string;
      venueLocation: string;
      numberOfGuests: string;
      selectedPackage: string;
      fullName: string;
      email: string;
      phone: string;
    };
    menuPackagesDescriptions: {
      basic: string;
      medium: string;
      max: string;
      classic: string;
      excellent: string;
    };
  };
  galleryPage: {
    title: string;
  };
  faqPage: {
    title: string;
  };
  contactPage: {
    title: string;
    mainText: string;
    website: string;
    email: string;
    phone: string;
    fbLink: string;
    slogan: string;
    signature: string;
  };
  common: {
    back: string;
  };
}

// Type-safe keys for `homePage`
export const HOME_PAGE_TRANSLATIONS =
  createTranslationKeys<PageTranslations['homePage']>('homePage');

// Type-safe keys for `formPage`
export const FORM_PAGE_TRANSLATIONS =
  createTranslationKeys<PageTranslations['formPage']>('formPage');

// Type-safe keys for `galleryPage`
export const GALLERY_PAGE_TRANSLATIONS =
  createTranslationKeys<PageTranslations['galleryPage']>('galleryPage');

// Type-safe keys for `faqPage`
export const FAQ_PAGE_TRANSLATIONS = createTranslationKeys<PageTranslations['faqPage']>('faqPage');

// Type-safe keys for `contactPage`
export const CONTACT_PAGE_TRANSLATIONS =
  createTranslationKeys<PageTranslations['contactPage']>('contactPage');

// Type-safe keys for `common`
export const COMMON = createTranslationKeys<PageTranslations['common']>('common');
