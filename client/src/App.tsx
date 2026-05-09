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

// ── Inline Ad Banner (between content and footer) ─────────
function InlineAdBanner() {
  const [adLoaded, setAdLoaded] = React.useState(false);

  React.useEffect(() => {
    try {
      const adsbygoogle = (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      adsbygoogle.push({});
      setTimeout(() => {
        const ins = document.querySelector('.inline-ad-banner ins.adsbygoogle') as HTMLElement | null;
        if (ins && ins.getAttribute('data-ad-status') === 'filled') setAdLoaded(true);
      }, 2500);
    } catch(e) {}
  }, []);

  return (
    <div className="inline-ad-banner">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-7798519284162823"
        data-ad-slot="auto"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      {!adLoaded && (
        <div className="inline-ad-placeholder">
          <span>🚀 <strong>Advertise with ReplyAI</strong> — reach thousands of professionals</span>
          <a href="mailto:peterjohn2343@gmail.com" className="inline-ad-cta">Partner with us</a>
        </div>
      )}
    </div>
  );
}
// ──────────────────────────────────────────────────────────

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

      <InlineAdBanner />
      <UnifiedFooter />
      <PricingModal />
      <ToastContainer />
      <CookieBanner />
      <NewsletterPopup />
    </div>
  );
}
