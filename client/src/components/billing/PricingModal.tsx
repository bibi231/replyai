import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useAuthStore } from '../../store/authStore';
import { CREDIT_PACKS } from '../../types';
import { api } from '../../lib/api';

type Gateway = 'monnify' | 'gtsquad';

export function PricingModal() {
    const { isPricingOpen, closePricing, user } = useAuthStore();
    const [gateway, setGateway] = useState<Gateway>('gtsquad');
    const [loadingPack, setLoadingPack] = useState<string | null>(null);
    const [error, setError] = useState('');

    const GATEWAYS = [
        { id: 'gtsquad' as Gateway,  label: 'GTSquad',  sub: 'USD · Intl Card', flag: '💳' },
        { id: 'monnify' as Gateway,  label: 'Monnify',  sub: 'NGN · Bank/Card', flag: '🇳🇬' },
    ];

    const handlePay = async (packId: string) => {
        if (!user?.email) return;
        setLoadingPack(packId);
        setError('');
        try {
            const endpoint = gateway === 'gtsquad'
                ? '/api/credits/gtsquad-checkout'
                : '/api/credits/monnify-checkout';
            const { data } = await api.post(endpoint, { packId, email: user.email });
            window.open(data.checkoutUrl, '_blank', 'noopener');
            closePricing();
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Could not start checkout. Please try again.');
        } finally {
            setLoadingPack(null);
        }
    };

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

            <p className="text-center text-xs text-[var(--text-muted,#666)] mb-6">
                {gateway === 'gtsquad'
                    ? 'Pay in USD — Visa, Mastercard, international cards accepted'
                    : 'Pay in NGN — Bank transfer, Debit card, USSD supported'}
            </p>

            {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                    {error}
                </div>
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
                                {gateway === 'monnify' ? (
                                    <span className="text-4xl font-display font-bold">₦{pack.price.toLocaleString()}</span>
                                ) : (
                                    <span className="text-4xl font-display font-bold">${pack.priceUSD}</span>
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
                            <button
                                onClick={() => handlePay(pack.id)}
                                disabled={loadingPack === pack.id}
                                className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                                    pack.popular
                                        ? 'bg-[var(--accent)] hover:opacity-90 text-white'
                                        : 'bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-white border border-[var(--border)]'
                                } disabled:opacity-50`}
                            >
                                {loadingPack === pack.id
                                    ? 'Opening checkout…'
                                    : gateway === 'gtsquad'
                                        ? '💳 Pay with GTSquad'
                                        : '🇳🇬 Pay with Monnify'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <p className="text-center text-xs text-[var(--text-muted,#666)] mt-6">
                🔒 Secure checkout · Credits added automatically after payment
            </p>
        </Modal>
    );
}
