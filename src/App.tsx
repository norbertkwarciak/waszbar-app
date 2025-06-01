import React from 'react';
import { Outlet } from 'react-router-dom';

const App = (): React.JSX.Element => {
  return (
    <div>
      <h1>Learning Cards App</h1>
      <div>pull request test</div>
      <Outlet />
    </div>
  );
};

export default App;
