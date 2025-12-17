const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

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
    assets: '',
    pdfs: '/pdfs',
  },
  turnstile: {
    siteKey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
  },
};
