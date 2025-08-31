type Env = {
  netlify: {
    functions: {
      getAvailability: string;
      getOffer: string;
      submitInquiry: string;
    };
  };
  ownerEmail: string;
  s3: {
    assetsUrl: string;
    pdfsUrl: string;
  };
};

export const env: Env = {
  netlify: {
    functions: {
      getAvailability: '/.netlify/functions/get-availability',
      getOffer: '/.netlify/functions/get-offer',
      submitInquiry: '/.netlify/functions/submit-inquiry',
    },
  },
  ownerEmail: 'biuro@waszbar.pl',
  s3: {
    assetsUrl: 'https://waszbar-storage.s3.eu-north-1.amazonaws.com/assets',
    pdfsUrl: 'https://waszbar-storage.s3.eu-north-1.amazonaws.com/pdfs',
  },
};
