import React from 'react';

const BackgroundImage = (): React.JSX.Element => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundImage: `image-set( url('/background.avif') type('image/avif'), url('/background.webp') type('image/webp') )`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        opacity: 0.3,
        filter: 'blur(1px)',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
};

export default BackgroundImage;
