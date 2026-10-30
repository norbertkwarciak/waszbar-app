const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';
const R2_PUBLIC_URL = (import.meta.env.VITE_R2_PUBLIC_URL || 'https://assets.waszbar.app').replace(
  /\/+$/,
  '',
);

type Env = {
  cookiesConsentKey: string;
  api: {
    calculateTravelCost: string;
    getAvailability: string;
    getOffer: string;
    sendInquiryEmail: string;
    submitInquiry: string;
  };
  ownerEmail: string;
  phoneNumber: string;
  public: {
    assets: string;
    pdfs: string;
  };
  turnstile: {
    siteKey: string;
  };
};

export const env: Env = {
  cookiesConsentKey: 'WaszBarApp__cookieConsent',
  api: {
    calculateTravelCost: `${API_BASE}/calculate-travel-cost`,
    getAvailability: `${API_BASE}/get-availability`,
    getOffer: `${API_BASE}/get-offer`,
    sendInquiryEmail: `${API_BASE}/send-inquiry-email`,
    submitInquiry: `${API_BASE}/submit-inquiry`,
  },
  ownerEmail: 'biuro@waszbar.pl',
  phoneNumber: '+48698836034',
  public: {
    assets: `${R2_PUBLIC_URL}/images`,
    pdfs: `${R2_PUBLIC_URL}/pdf`,
  },
  turnstile: {
    siteKey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
  },
};
