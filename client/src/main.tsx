import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import './styles/home.css';
import './styles/navbar.css';
import './styles/footer.css';

const rootEl = document.getElementById('root')!;
const boot = document.getElementById('rai-boot');

createRoot(rootEl).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Splash removal is handled in App.tsx to sync with auth state
