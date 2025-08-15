import React, { lazy } from 'react'; // { lazy }
import ReactDOM from 'react-dom/client';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { MantineProvider, createTheme } from '@mantine/core';
import App from './App';
import { Notifications } from '@mantine/notifications';

import './core/theme/theme-style.scss';

const HomePage = lazy(() => import('./pages/HomePage'));
const FormPage = lazy(() => import('./pages/FormPage'));

const flatColor = (
  hex: string,
): [string, string, string, string, string, string, string, string, string, string] =>
  Array(10).fill(hex) as [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ];

const theme = createTheme({
  /** Put your mantine theme override here */
  colors: {
    primary: [
      '#E6F3F3',
      '#B3DADC',
      '#80C1C5',
      '#4DA8AD',
      '#1A8F96',
      '#00838A',
      '#00767C',
      '#00696E',
      '#005C61',
      '#004F53',
    ],
    secondary: flatColor('#5479BD'),
  },
  primaryColor: 'primary',
  primaryShade: 5,
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'form/:formType',
        element: <FormPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <Notifications />
      <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>,
);
