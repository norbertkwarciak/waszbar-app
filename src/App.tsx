import React from 'react';
import { Outlet } from 'react-router-dom';

const App = (): React.JSX.Element => {
  return (
    <div>
      <h1>WaszBar - wyceny</h1>
      <div>{import.meta.env.VITE_API_URL}</div>
      <Outlet />
    </div>
  );
};

export default App;
