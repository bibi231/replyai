import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { CREDIT_PACKS } from '../types';
import { PaystackButton } from '../components/billing/PaystackButton';

export function Pricing() {
  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto w-full pt-8 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-4">Simple, Pay-As-You-Go Pricing</h1>
          <p className="text-lg text-[var(--text-secondary)]">Buy credits once, use them forever. 1 credit = 3 reply drafts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {CREDIT_PACKS.map((pack) => (
            <div key={pack.id} className={`relative bg-[var(--bg-elevated)] border ${pack.popular ? 'border-[var(--accent)] shadow-[0_0_30px_rgba(108,99,255,0.15)] scale-105 z-10' : 'border-[var(--border)]'} rounded-2xl p-8 flex flex-col`}>
              {pack.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-medium text-white mb-2">{pack.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-display font-bold">₦{pack.price.toLocaleString()}</span>
                </div>
                <p className="text-[var(--text-secondary)] mt-2 text-sm">{pack.pricePerReply} per reply equivalent</p>
              </div>

              <div className="flex-grow">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start text-[var(--text-primary)]">
                    <svg className="w-5 h-5 text-[var(--success)] mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {pack.credits} Credits
                  </li>
                  <li className="flex items-start text-[var(--text-primary)]">
                    <svg className="w-5 h-5 text-[var(--success)] mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Credits never expire
                  </li>
                  <li className="flex items-start text-[var(--text-primary)]">
                    <svg className="w-5 h-5 text-[var(--success)] mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Generate 3 drafts per credit
                  </li>
                </ul>
              </div>

              <PaystackButton packId={pack.id} className="w-full mt-auto" />
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-display text-white mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid gap-6">
            <div className="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border)]">
              <h4 className="text-lg font-medium text-white mb-2">Do credits expire?</h4>
              <p className="text-[var(--text-secondary)]">No, paid credits never expire. Free credits (5 per month) reset on the 1st of every calendar month.</p>
            </div>
            <div className="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border)]">
              <h4 className="text-lg font-medium text-white mb-2">What counts as 1 generation?</h4>
              <p className="text-[var(--text-secondary)]">One generation = 1 credit = 3 different reply drafts returned simultaneously.</p>
            </div>
            <div className="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border)]">
              <h4 className="text-lg font-medium text-white mb-2">Can I use it on mobile?</h4>
              <p className="text-[var(--text-secondary)]">Yes! The web app is fully mobile-optimised, so you can copy-paste emails directly from your phone.</p>
            </div>
            <div className="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border)]">
              <h4 className="text-lg font-medium text-white mb-2">What payment methods are supported?</h4>
              <p className="text-[var(--text-secondary)]">We use Paystack, which supports Visa, Mastercard, Verve, bank transfers, and USSD payments.</p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
