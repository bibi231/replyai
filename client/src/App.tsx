import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { AppPage } from './pages/AppPage';
import { Pricing } from './pages/Pricing';
import { Dashboard } from './pages/Dashboard';
import { AuthGuard } from './components/auth/AuthGuard';
import { UnifiedFooter } from './components/layout/UnifiedFooter';
import { PricingModal } from './components/billing/PricingModal';
import { ToastContainer } from './components/ui/Toast';
import { useAuth } from './hooks/useAuth';

import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Refund } from './pages/Refund';
import { Cookies } from './pages/Cookies';
import { Settings } from './pages/Settings';

import { CookieBanner } from './components/layout/CookieBanner';
import { NewsletterPopup } from './components/marketing/NewsletterPopup';

export default function App() {
  useAuth();

  return (
    <div className="app-container">
      <main className="layout-wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/refund" element={<Refund />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/settings" element={
            <AuthGuard>
              <Settings />
            </AuthGuard>
          } />
          <Route
            path="/app"
            element={
              <AuthGuard>
                <AppPage />
              </AuthGuard>
            }
          />
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            }
          />
        </Routes>
      </main>

      <UnifiedFooter />
      <PricingModal />
      <ToastContainer />
      <CookieBanner />
      <NewsletterPopup />
    </div>
  );
}
