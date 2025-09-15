import React from 'react';
import { Outlet } from 'react-router-dom';
import AppLayout from './components/AppLayout';

const App = (): React.JSX.Element => {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

export default App;
