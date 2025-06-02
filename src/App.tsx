import React from 'react';
import { Outlet } from 'react-router-dom';

const App = (): React.JSX.Element => {
  console.log(import.meta.env);
  return (
    <div>
      <h1>Learning Cards App</h1>
      <div>pull request test</div>
      <div>{import.meta.env.VITE_API_URL}</div>
      <Outlet />
    </div>
  );
};

export default App;
