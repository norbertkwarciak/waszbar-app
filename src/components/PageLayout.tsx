import { Box, Image } from '@mantine/core';
import { ReactNode } from 'react';
import { IMAGES } from '@/config/assets';
interface PageLayoutProps {
  children: ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps): React.JSX.Element => {
  return (
    <Box pos="relative" mih="100vh">
      <Box pos="absolute" top={20} right={20}>
        <Image src={IMAGES.logo} alt="Logo" height={100} />
      </Box>

      {children}
    </Box>
  );
};

export default PageLayout;
