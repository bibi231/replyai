import React, { useState, useEffect } from 'react';
import '../styles/pricing.css';
import { Navbar } from '../components/layout/Navbar';
import { useCredits } from '../hooks/useCredits';
import { useAuthStore } from '../store/authStore';
import { CREDIT_PACKS, detectCurrency } from '../types';
import { api } from '../lib/api';

export function Pricing() {
  const { credits } = useCredits();
  const user = useAuthStore(s => s.user);
  // Auto-detect: African timezone -> NGN, anywhere else -> USD. User can override.
  const [currency, setCurrency] = useState<'NGN' | 'USD'>(() => detectCurrency());
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (packId: string) => {
    if (!user) { window.location.href = '/app'; return; }
    setLoading(packId);
    try {
      const endpoint = currency === 'NGN' ? '/api/credits/gtsquad-checkout' : '/api/credits/lemonsqueezy-checkout';
      const { data } = await api.post(endpoint, { packId });
      if (data.checkoutUrl) window.open(data.checkoutUrl, '_blank', 'noopener');
    } catch (err) {
      console.error('Checkout error', err);
      alert('Could not open checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  // Persist explicit user toggle so it survives reload
  useEffect(() => {
    try { window.localStorage.setItem('replyai:currency', currency); } catch {}
  }, [currency]);

  return (
    <div className="pricing-page">
      <Navbar />
      <main className="pricing-main">
        <div className="pricing-header">
          <div className="section-label">Pricing</div>
          <h1 className="pricing-title">Start free. Pay as you need.</h1>
          <p className="pricing-sub">Everyone gets 5 free reply generations every month. Buy credits when you need more &mdash; they never expire.</p>

          <div className="currency-toggle-container">
            <span className={`currency-label ${currency === 'NGN' ? 'active' : ''}`}>NGN (Local)</span>
            <button className="currency-toggle" onClick={() => setCurrency(c => c === 'NGN' ? 'USD' : 'NGN')}>
              <div className={`currency-toggle-knob ${currency === 'USD' ? 'right' : ''}`} />
            </button>
            <span className={`currency-label ${currency === 'USD' ? 'active' : ''}`}>USD (Global)</span>
          </div>

          {credits && (
            <div className="current-credits">
              You currently have {credits.free > 0 ? `${credits.free} free ${credits.free === 1 ? 'reply' : 'replies'}` : '0 free replies'} remaining
              {credits.paid > 0 && ` + ${credits.paid} paid credits`}.
            </div>
          )}
        </div>

        <div className="pricing-cards">
          {CREDIT_PACKS.map(pack => (
            <div key={pack.id} className={`pricing-card ${pack.popular ? 'popular' : ''}`}>
              {pack.popular && <div className="popular-badge">Most popular</div>}
              <div className="pricing-card-header">
                <span className="pricing-pack-name">{pack.name}</span>
                <div className="pricing-price">
                  <span className="pricing-amount">
                    {currency === 'NGN' ? `₦${pack.price.toLocaleString()}` : `$${pack.priceUSD}`}
                  </span>
                </div>
                <div className="pricing-credits">{pack.credits} credits</div>
                <div className="pricing-cost-per">
                  {currency === 'NGN' ? `${pack.pricePerReply} per reply` : `${pack.pricePerReplyUSD} per reply`}
                </div>
              </div>
              <ul className="pricing-features">
                <li className="pricing-feature">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  {pack.credits} reply generations
                </li>
                <li className="pricing-feature">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  {pack.credits * 3} total drafts
                </li>
                <li className="pricing-feature">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  All 5 tone options
                </li>
                <li className="pricing-feature">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  Never expires
                </li>
              </ul>
              <div className="pricing-card-footer">
                {user ? (
                  <button
                    className="pricing-buy-btn"
                    onClick={() => handleCheckout(pack.id)}
                    disabled={loading === pack.id}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', fontWeight: 700, fontSize: 15, cursor: 'pointer', background: pack.popular ? '#6366f1' : '#23283a', color: '#fff', border: 'none', opacity: loading === pack.id ? 0.7 : 1 }}
                  >
                    {loading === pack.id ? 'Opening checkout…' : currency === 'NGN' ? `Buy ₦${pack.price.toLocaleString()}` : `Buy $${pack.priceUSD}`}
                  </button>
                ) : (
                  <a href="/app" className="pricing-signin-cta">Sign in to purchase</a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pricing-faq">
          <h2 className="faq-title">Common questions</h2>
          {[
            { q: 'Do credits expire?', a: 'Paid credits never expire. Free credits reset on the 1st of every month.' },
            { q: 'What counts as 1 credit?', a: '1 credit = 1 generation = 3 complete reply drafts delivered simultaneously.' },
            { q: 'What payment methods work?', a: 'NGN payments go through GTSquad (Visa, Mastercard, USSD, bank transfer). USD payments go through Lemon Squeezy (international cards, PayPal).' },
            { q: 'Can I use it on mobile?', a: 'The web dashboard works on any device. The Gmail extension requires Chrome on desktop.' },
          ].map(item => (
            <div key={item.q} className="faq-item">
              <h3 className="faq-q">{item.q}</h3>
              <p className="faq-a">{item.a}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
