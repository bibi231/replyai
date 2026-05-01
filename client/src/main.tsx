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

// Remove inline boot shell once React mounts
if (boot) {
  requestAnimationFrame(() => {
    boot.style.transition = 'opacity .3s ease';
    boot.style.opacity = '0';
    setTimeout(() => boot.remove(), 320);
  });
}
