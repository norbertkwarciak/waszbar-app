export const env = {
  netlify: {
    functions: {
      getAvailability: '/.netlify/functions/get-availability',
    },
  },
  s3: {
    assetsUrl: 'https://waszbar-storage.s3.eu-north-1.amazonaws.com/assets',
    pdfsUrl: 'https://waszbar-storage.s3.eu-north-1.amazonaws.com/pdfs',
  },
};
