import React, { lazy } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import ReactDOM from 'react-dom/client';
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { MantineProvider, createTheme } from '@mantine/core';
import App from './App';
import { Notifications } from '@mantine/notifications';
import './i18n';

import './core/theme/theme-style.scss';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

// Use localStorage as a cache persister
const localStoragePersister = createAsyncStoragePersister({
  storage: window.localStorage,
});

persistQueryClient({
  queryClient,
  persister: localStoragePersister,
  maxAge: 1000 * 60 * 60 * 24, // persist for 24 hours
});

const HomePage = lazy(() => import('./pages/HomePage'));
const FormPage = lazy(() => import('./pages/FormPage'));
const FaqPage = lazy(() => import('./pages/FaqPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));

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
      {
        path: 'gallery',
        element: <GalleryPage />,
      },
      {
        path: 'faq',
        element: <FaqPage />,
      },
      {
        path: 'contact',
        element: <ContactPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <Notifications />
        <RouterProvider router={router} />
      </MantineProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
