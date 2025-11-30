type Env = {
  cookiesConsentKey: string;
  netlify: {
    functions: {
      calculateTravelCost: string;
      getAvailability: string;
      getOffer: string;
      sendInquiryEmail: string;
      submitInquiry: string;
    };
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
  netlify: {
    functions: {
      calculateTravelCost: '/.netlify/functions/calculate-travel-cost',
      getAvailability: '/.netlify/functions/get-availability',
      getOffer: '/.netlify/functions/get-offer',
      sendInquiryEmail: '/.netlify/functions/send-inquiry-email',
      submitInquiry: '/.netlify/functions/submit-inquiry',
    },
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
