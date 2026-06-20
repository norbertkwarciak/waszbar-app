import React, { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { IconWifiOff, IconWifi } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import AppLayout from './components/AppLayout';
import CookieBanner from './components/CookieBanner';
import { useOnlineStatus } from './core/utils/hooks/useOnlineStatus';

const App = (): React.JSX.Element => {
  const { t } = useTranslation();
  const isOnline = useOnlineStatus();
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (!isOnline) {
      notifications.show({
        id: 'connection-status',
        title: t('common.connectionLost'),
        message: '',
        color: 'red',
        icon: <IconWifiOff size={20} />,
        autoClose: false,
      });
    } else {
      notifications.hide('connection-status');
      notifications.show({
        title: t('common.connectionRestored'),
        message: '',
        color: 'green',
        icon: <IconWifi size={20} />,
        autoClose: 3000,
      });
    }
  }, [isOnline, t]);

  return (
    <AppLayout>
      <Outlet />
      <CookieBanner />
    </AppLayout>
  );
};

export default App;
