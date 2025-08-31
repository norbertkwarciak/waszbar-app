type Env = {
  netlify: {
    functions: {
      getAvailability: string;
      getOffer: string;
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
    },
  },
  ownerEmail: 'waszbar.barmani@gmail.com',
  s3: {
    assetsUrl: 'https://waszbar-storage.s3.eu-north-1.amazonaws.com/assets',
    pdfsUrl: 'https://waszbar-storage.s3.eu-north-1.amazonaws.com/pdfs',
  },
};
