import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { useAuthStore } from '../../store/authStore';
import { CREDIT_PACKS, detectCurrency } from '../../types';
import { api } from '../../lib/api';

type Currency = 'NGN' | 'USD';
type Provider = 'gtsquad' | 'lemonsqueezy';
declare global { interface Window { Squad: any; LemonSqueezy: any; } }

export function PricingModal() {
    const { isPricingOpen, closePricing, user } = useAuthStore();
    const [currency, setCurrency] = useState<Currency>(() => detectCurrency());
    const [provider, setProvider] = useState<Provider>('gtsquad');
    const [loadingPack, setLoadingPack] = useState<string | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        try { window.localStorage.setItem('replyai:currency', currency); } catch {}
    }, [currency]);

    const handlePay = async (packId: string) => {
        if (!user?.email) return;
        setLoadingPack(packId);
        setError('');
        try {
            if (provider === 'lemonsqueezy') {
                const { data } = await api.post('/api/credits/lemonsqueezy-checkout', { packId });
                if (window.LemonSqueezy && window.LemonSqueezy.Url) {
                    window.LemonSqueezy.Url.Open(data.checkoutUrl);
                } else {
                    window.open(data.checkoutUrl, '_blank', 'noopener');
                }
                setLoadingPack(null);
                return;
            }
            // Default: Squad inline popup
            const { data } = await api.post('/api/credits/gtsquad-checkout', { packId, currency });
            if (!window.Squad) {
                setError('Payment widget failed to load. Please refresh the page.');
                setLoadingPack(null);
                return;
            }
            const squad = new window.Squad({
                key: data.publicKey,
                email: data.email,
                amount: data.amount,
                currency_code: data.currency,
                transaction_ref: data.transactionRef,
                customer_name: data.customerName,
                metadata: data.metadata,
                onClose: () => setLoadingPack(null),
                onSuccess: () => {
                    window.dispatchEvent(new Event('credits:refresh'));
                    closePricing();
                    setLoadingPack(null);
                },
            });
            squad.setup();
            squad.open();
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Could not start checkout. Please try again.');
            setLoadingPack(null);
        }
    };

    return (
        <Modal isOpen={isPricingOpen} onClose={closePricing} maxWidth="max-w-4xl">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-display text-white mb-3">Simple, Pay-As-You-Go Pricing</h2>
                <p className="text-[var(--text-secondary)]">Buy credits once, use them forever. 1 credit = 3 reply drafts.</p>
            </div>

            {/* Currency toggle */}
            <div className="flex gap-2 mb-4 p-1 bg-[var(--bg-raised,#1a1a2e)] rounded-xl border border-[var(--border)] max-w-xs mx-auto">
                {(['NGN', 'USD'] as Currency[]).map(c => (
                    <button key={c} onClick={() => setCurrency(c)}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                            currency === c ? 'bg-[var(--accent)] text-white shadow' : 'text-[var(--text-secondary)] hover:text-white'
                        }`}>
                        {c === 'NGN' ? '🇳🇬 NGN' : '💳 USD'}
                    </button>
                ))}
            </div>

            {/* USD-only: provider toggle */}
            {currency === 'USD' && (
                <div className="flex gap-2 mb-6 p-1 bg-[var(--bg-raised,#1a1a2e)] rounded-xl border border-[var(--border)] max-w-sm mx-auto">
                    {(['gtsquad', 'lemonsqueezy'] as Provider[]).map(p => (
                        <button key={p} onClick={() => setProvider(p)}
                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                                provider === p ? 'bg-[var(--accent)] text-white shadow' : 'text-[var(--text-secondary)] hover:text-white'
                            }`}>
                            {p === 'gtsquad' ? 'GTSquad (Card)' : 'Lemon Squeezy'}
                        </button>
                    ))}
                </div>
            )}

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
                                <span className="text-4xl font-display font-bold">
                                    {currency === 'NGN' ? `₦${pack.price.toLocaleString()}` : `$${pack.priceUSD}`}
                                </span>
                            </div>
                            <p className="text-[var(--text-secondary)] mt-2 text-sm">
                                {currency === 'NGN' ? pack.pricePerReply : pack.pricePerReplyUSD} per reply
                            </p>
                        </div>
                        <ul className="space-y-3 mb-8 flex-grow">
                            <li className="flex items-center text-sm text-[var(--text-primary)]">
                                <svg className="w-5 h-5 text-[var(--success)] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                {pack.credits} Credits ({pack.credits * 3} drafts)
                            </li>
                            <li className="flex items-center text-sm text-[var(--text-primary)]">
                                <svg className="w-5 h-5 text-[var(--success)] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Credits never expire
                            </li>
                        </ul>
                        <button
                            onClick={() => handlePay(pack.id)}
                            disabled={loadingPack === pack.id}
                            className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                                pack.popular
                                    ? 'bg-[var(--accent)] hover:opacity-90 text-white'
                                    : 'bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-white border border-[var(--border)]'
                            } disabled:opacity-50`}>
                            {loadingPack === pack.id
                                ? 'Opening checkout...'
                                : `Pay ${currency === 'NGN' ? `₦${pack.price.toLocaleString()}` : `$${pack.priceUSD}`}`}
                        </button>
                    </div>
                ))}
            </div>

            <p className="text-center text-xs text-[var(--text-muted,#666)] mt-6">
                🔒 Secure checkout — Credits added automatically after payment
            </p>
        </Modal>
    );
}
