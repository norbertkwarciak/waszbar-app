import { Image, Paper, Stack, Box } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Link } from 'react-router-dom';
import React from 'react';

interface BarCardProps {
  image: string;
  alt: string;
  buttonText: string;
  to?: string;
  onClick?: () => void;
}

const BarCard = ({ image, alt, buttonText, to, onClick }: BarCardProps): React.JSX.Element => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const commonProps = {
    shadow: 'md',
    radius: 'md',
    p: 'md',
    withBorder: true,
    w: isMobile ? '100%' : 400,
    ta: 'center' as const,
    style: {
      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      textDecoration: 'none',
      cursor: 'pointer',
      margin: '0 auto',
    },
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.boxShadow = 'var(--mantine-shadow-md)';
    },
  };

  const content = (
    <Stack align="center">
      <Image
        component="img"
        data-src={image}
        className="lazyload blur-on-load"
        alt={alt}
        height={300}
        fit="cover"
        radius="md"
      />
      <Box
        mt="sm"
        px="md"
        py="sm"
        w="100%"
        style={{
          borderRadius: 'var(--mantine-radius-default)',
          backgroundColor: 'var(--mantine-color-primary-filled)',
          color: 'white',
          fontWeight: 500,
          fontSize: '16px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease',
        }}
      >
        {buttonText}
      </Box>
    </Stack>
  );

  if (to) {
    return (
      <Paper component={Link} to={to} {...commonProps}>
        {content}
      </Paper>
    );
  }

  return (
    <Paper
      component="div"
      {...commonProps}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter') onClick?.();
      }}
    >
      {content}
    </Paper>
  );
};

export default BarCard;
