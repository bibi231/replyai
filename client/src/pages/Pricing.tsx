import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { PaystackButton } from '../components/billing/PaystackButton';
import { useCredits } from '../hooks/useCredits';
import { useAuthStore } from '../store/authStore';

export function Pricing() {
  const { credits } = useCredits();
  const user = useAuthStore(s => s.user);

  const PACKS = [
    { id: 'starter' as const, name: 'Starter', price: 1500, credits: 30, costPer: '₦50', features: ['30 reply generations', '90 total drafts', 'All 5 tone options', 'Never expires'] },
    { id: 'pro' as const, name: 'Pro', price: 3500, credits: 100, costPer: '₦35', popular: true, features: ['100 reply generations', '300 total drafts', 'All 5 tone options', 'Priority generation', 'Never expires'] },
    { id: 'power' as const, name: 'Power', price: 8000, credits: 300, costPer: '₦27', features: ['300 reply generations', '900 total drafts', 'All 5 tone options', 'Priority generation', 'Never expires'] },
  ];

  return (
    <div className="pricing-page">
      <Navbar />
      <main className="pricing-main">
        <div className="pricing-header">
          <div className="section-label">Pricing</div>
          <h1 className="pricing-title">Start free. Pay as you need.</h1>
          <p className="pricing-sub">Everyone gets 5 free reply generations every month. Buy credits when you need more — they never expire.</p>
          {credits && (
            <div className="current-credits">
              You currently have {credits.free > 0 ? `${credits.free} free ${credits.free === 1 ? 'reply' : 'replies'}` : '0 free replies'} remaining
              {credits.paid > 0 && ` + ${credits.paid} paid credits`}.
            </div>
          )}
        </div>

        <div className="pricing-cards">
          {PACKS.map(pack => (
            <div key={pack.id} className={`pricing-card ${pack.popular ? 'popular' : ''}`}>
              {pack.popular && <div className="popular-badge">Most popular</div>}
              <div className="pricing-card-header">
                <span className="pricing-pack-name">{pack.name}</span>
                <div className="pricing-price">
                  <span className="pricing-amount">₦{pack.price.toLocaleString()}</span>
                </div>
                <div className="pricing-credits">{pack.credits} credits</div>
                <div className="pricing-cost-per">{pack.costPer} per reply</div>
              </div>
              <ul className="pricing-features">
                {pack.features.map(f => (
                  <li key={f} className="pricing-feature">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="pricing-card-footer">
                {user ? (
                  <PaystackButton packId={pack.id} className="w-full" />
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
            { q: 'What payment methods work?', a: 'Visa, Mastercard, bank transfer, Verve, and USSD — all handled securely by Paystack.' },
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
