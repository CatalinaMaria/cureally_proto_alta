import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './auth';
import { CareStoreProvider } from './care-store';
import '../styles/tokens.css';
import '../styles/base.css';
import '../styles/components.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <CareStoreProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CareStoreProvider>
    </AuthProvider>
  </React.StrictMode>,
);
