import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './routers/router.jsx';
import { authListener } from './redux/features/auth/authListener.js';
import { Provider } from "react-redux";
import { persistor, store } from './redux/store.js';
import { PersistGate } from 'redux-persist/integration/react';
import { checkManualReduxDelete } from './redux/features/auth/manualReduxCheck.js';
import GlobalErrorBoundary from './components/GlobalErrorBoundary.jsx';
import { Toaster } from 'react-hot-toast';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

authListener(store);

createRoot(rootElement).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}
    onBeforeLift={() => {
      checkManualReduxDelete()
    }}
    >
      <GlobalErrorBoundary>
    <Toaster position="top-right" />
    <RouterProvider router={router} />
    </GlobalErrorBoundary>
    </PersistGate>
  </Provider>,
);