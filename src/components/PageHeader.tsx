import { Box, Button, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import { COMMON } from '@/i18n/tKeys';
import { useTranslation } from 'react-i18next';

interface PageLayoutProps {
  title?: string;
}

const PageHeader = ({ title }: PageLayoutProps): React.JSX.Element => {
  const { t } = useTranslation();

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
      <Button
        component={Link}
        to="/"
        variant="outline"
        size="xs"
        style={{ position: 'absolute', left: 0, top: 0 }}
      >
        {t(COMMON.back)}
      </Button>
      <Title order={2}>{title}</Title>
      <div />
    </Box>
  );
};

export default PageHeader;
