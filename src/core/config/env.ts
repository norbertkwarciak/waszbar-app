type Env = {
  netlify: {
    functions: {
      getAvailability: string;
      getOffer: string;
      sendInquiryEmail: string;
      submitInquiry: string;
    };
  };
  ownerEmail: string;
  public: {
    assets: string;
    pdfs: string;
  };
};

export const env: Env = {
  netlify: {
    functions: {
      getAvailability: '/.netlify/functions/get-availability',
      getOffer: '/.netlify/functions/get-offer',
      sendInquiryEmail: '/.netlify/functions/send-inquiry-email',
      submitInquiry: '/.netlify/functions/submit-inquiry',
    },
  },
  ownerEmail: 'biuro@waszbar.pl',
  public: {
    assets: '/assets',
    pdfs: '/pdfs',
  },
};
