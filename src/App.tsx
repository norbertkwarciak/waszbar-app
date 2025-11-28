import React from 'react';
import { Outlet } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import CookieBanner from './components/CookieBanner';

const App = (): React.JSX.Element => {
  return (
    <AppLayout>
      <Outlet />
      <CookieBanner />
    </AppLayout>
  );
};

export default App;
