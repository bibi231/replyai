import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useAuthStore } from '../../store/authStore';
import { CREDIT_PACKS } from '../../types';
import { PaystackButton } from './PaystackButton';
import { GumroadButton } from './GumroadButton';
import { LemonSqueezyButton } from './LemonSqueezyButton';

type PayGateway = 'paystack' | 'gumroad' | 'lemonsqueezy';

export function PricingModal() {
    const { isPricingOpen, closePricing } = useAuthStore();
    const [gateway, setGateway] = useState<PayGateway>('paystack');

    const GATEWAYS: { id: PayGateway; label: string; sub: string; flag: string }[] = [
        { id: 'paystack',     label: 'Paystack',      sub: 'NGN · Card/Transfer',   flag: '🇳🇬' },
        { id: 'gumroad',      label: 'Gumroad',       sub: 'USD · Card worldwide',  flag: '🌍' },
        { id: 'lemonsqueezy', label: 'LemonSqueezy',  sub: 'USD · Card worldwide',  flag: '💛' },
    ];

    return (
        <Modal isOpen={isPricingOpen} onClose={closePricing} maxWidth="max-w-4xl">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-display text-white mb-3">Simple, Pay-As-You-Go Pricing</h2>
                <p className="text-[var(--text-secondary)]">Buy credits once, use them forever. 1 credit = 3 reply drafts.</p>
            </div>

            {/* Payment gateway selector */}
            <div className="flex gap-2 mb-8 p-1 bg-[var(--bg-raised,#1a1a2e)] rounded-xl border border-[var(--border)]">
                {GATEWAYS.map(g => (
                    <button
                        key={g.id}
                        onClick={() => setGateway(g.id)}
                        className={`flex-1 flex flex-col items-center py-3 px-2 rounded-lg text-center transition-all text-sm font-medium ${
                            gateway === g.id
                                ? 'bg-[var(--accent)] text-white shadow'
                                : 'text-[var(--text-secondary)] hover:text-white'
                        }`}
                    >
                        <span className="text-lg mb-0.5">{g.flag}</span>
                        <span className="font-semibold text-xs">{g.label}</span>
                        <span className="text-[10px] opacity-70 mt-0.5">{g.sub}</span>
                    </button>
                ))}
            </div>

            {gateway === 'paystack' && (
                <p className="text-center text-xs text-[var(--text-muted,#666)] mb-6">
                    Pay in ₦ NGN — Debit card, bank transfer, USSD supported
                </p>
            )}
            {(gateway === 'gumroad' || gateway === 'lemonsqueezy') && (
                <p className="text-center text-xs text-[var(--text-muted,#666)] mb-6">
                    Pay in USD — Visa, Mastercard, Apple Pay accepted worldwide
                </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {CREDIT_PACKS.map((pack) => (
                    <div key={pack.id} className={`relative bg-[var(--bg-surface)] border ${pack.popular ? 'border-[var(--accent)]' : 'border-[var(--border)]'} rounded-2xl p-6 flex flex-col`}>
                        {pack.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                                Most Popular
                            </div>
                        )}

                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-white mb-2">{pack.name}</h3>
                            <div className="flex items-baseline gap-1">
                                {gateway === 'paystack' ? (
                                    <span className="text-4xl font-display font-bold">₦{pack.price.toLocaleString()}</span>
                                ) : (
                                    <span className="text-4xl font-display font-bold">${pack.priceUsd ?? (pack.price / 1500).toFixed(0)}</span>
                                )}
                            </div>
                            <p className="text-[var(--text-secondary)] mt-2 text-sm">{pack.pricePerReply} per reply equivalent</p>
                        </div>

                        <div className="flex-grow">
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center text-sm text-[var(--text-primary)]">
                                    <svg className="w-5 h-5 text-[var(--success)] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    {pack.credits} Credits
                                </li>
                                <li className="flex items-center text-sm text-[var(--text-primary)]">
                                    <svg className="w-5 h-5 text-[var(--success)] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Credits never expire
                                </li>
                            </ul>
                        </div>

                        <div className="mt-auto">
                            {gateway === 'paystack' && <PaystackButton packId={pack.id as any} />}
                            {gateway === 'gumroad' && <GumroadButton packId={pack.id as any} />}
                            {gateway === 'lemonsqueezy' && <LemonSqueezyButton packId={pack.id as any} />}
                        </div>
                    </div>
                ))}
            </div>
        </Modal>
    );
}
