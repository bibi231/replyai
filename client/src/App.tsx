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
import { useAuthStore } from './store/authStore';

import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Refund } from './pages/Refund';
import { Cookies } from './pages/Cookies';
import { Settings } from './pages/Settings';
import { Meetings } from './pages/Meetings';
import { MeetingDetail } from './pages/MeetingDetail';
import { FeatureMeetings } from './pages/FeatureMeetings';
import { Features } from './pages/Features';
import { About } from './pages/About';
import { FAQ } from './pages/FAQ';

import { CookieBanner } from './components/layout/CookieBanner';
import { NewsletterPopup } from './components/marketing/NewsletterPopup';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { AdminPage } from './pages/AdminPage';
import NotFound from './pages/NotFound';
import { AskAI } from './components/AskAI';

export default function App() {
  const isAuthLoading = useAuthStore(s => s.isAuthLoading);
  useAuth();

  React.useEffect(() => {
    if (!isAuthLoading) {
      const splash = document.getElementById('rai-boot');
      if (splash) {
        splash.style.transition = 'opacity .4s ease';
        splash.style.opacity = '0';
        setTimeout(() => splash.remove(), 450);
      }
    }
  }, [isAuthLoading]);

  if (isAuthLoading) return null;

  return (
    <div className="app-container">
      <main className="layout-wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/features" element={<Features />} />
          <Route path="/features/meetings" element={<FeatureMeetings />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/refund" element={<Refund />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/settings" element={
            <AuthGuard><Settings /></AuthGuard>
          } />
          <Route path="/app" element={
            <AuthGuard><AppPage /></AuthGuard>
          } />
          <Route path="/meetings" element={
            <AuthGuard><Meetings /></AuthGuard>
          } />
          <Route path="/meetings/:id" element={
            <AuthGuard><MeetingDetail /></AuthGuard>
          } />
          <Route path="/dashboard" element={
            <AuthGuard><Dashboard /></AuthGuard>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <UnifiedFooter />
      <PricingModal />
      <ToastContainer />
      <CookieBanner />
      <NewsletterPopup />
      <AskAI />
    </div>
  );
}
