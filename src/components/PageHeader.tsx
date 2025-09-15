import { Box, Title } from '@mantine/core';

interface PageLayoutProps {
  title?: string;
}

const PageHeader = ({ title }: PageLayoutProps): React.JSX.Element => {
  return (
    <Box
      w="100%"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <Title order={2}>{title}</Title>
      <div />
    </Box>
  );
};

export default PageHeader;
