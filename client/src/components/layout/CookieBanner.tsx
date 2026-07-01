import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const KEY = 'replyai_cookie_consent';

// Analytics only runs when a real GA4 ID is supplied via env (VITE_GA_ID).
// Until then ReplyAI uses essential cookies ONLY — and the banner says exactly
// that, with no claims about analytics or ads that aren't actually running.
const GA_ID = ((import.meta as any).env?.VITE_GA_ID as string) || '';
const ANALYTICS_ENABLED = /^G-[A-Z0-9]+$/.test(GA_ID) && GA_ID !== 'G-XXXXXXXXXX';

function applyConsent(accepted: boolean) {
  if (!ANALYTICS_ENABLED) return; // nothing to gate when analytics isn't configured
  const w = window as any;
  if (w.gtag) {
    w.gtag('consent', 'update', { analytics_storage: accepted ? 'granted' : 'denied' });
    if (accepted) w.gtag('config', GA_ID, { page_path: window.location.pathname });
  }
  w[`ga-disable-${GA_ID}`] = !accepted;
  if (!accepted) {
    ['_ga', '_gid', '_gat'].forEach((name) => {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${location.hostname}`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${location.hostname}`;
    });
  }
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [details, setDetails] = useState(false);

  useEffect(() => {
    // No optional analytics configured → essential cookies only, nothing to consent to.
    if (!ANALYTICS_ENABLED) return;
    const stored = localStorage.getItem(KEY);
    if (!stored) setTimeout(() => setVisible(true), 1200);
    else applyConsent(stored === 'accepted');
  }, []);

  const accept = () => { localStorage.setItem(KEY, 'accepted'); applyConsent(true); setVisible(false); };
  const decline = () => { localStorage.setItem(KEY, 'declined'); applyConsent(false); setVisible(false); };

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie consent">
      <div className="cookie-inner">
        <div className="cookie-text">
          <p>
            <strong>We use cookies</strong> — essential ones keep you logged in; optional analytics
            (Google Analytics page views) help us improve ReplyAI. No ads, no third-party ad tracking.{' '}
            <Link to="/cookies">Learn more</Link>
          </p>
          {details && (
            <ul className="cookie-detail-list">
              <li><strong>Essential</strong> — login sessions, security. Always active.</li>
              <li><strong>Analytics</strong> — Google Analytics (page views only). Off until you accept.</li>
            </ul>
          )}
          <button className="cookie-details-toggle" onClick={() => setDetails((d) => !d)}>
            {details ? 'Hide details ▲' : 'Show details ▼'}
          </button>
        </div>
        <div className="cookie-actions">
          <button className="btn-secondary btn-sm" onClick={decline}>Decline optional</button>
          <button className="btn-primary btn-sm" onClick={accept}>Accept all</button>
        </div>
      </div>
    </div>
  );
}
