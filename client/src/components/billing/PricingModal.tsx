import React from 'react';
import { Modal } from '../ui/Modal';
import { useAuthStore } from '../../store/authStore';
import { CREDIT_PACKS } from '../../types';
import { PaystackButton } from './PaystackButton';

export function PricingModal() {
    const { isPricingOpen, closePricing } = useAuthStore();

    return (
        <Modal isOpen={isPricingOpen} onClose={closePricing} maxWidth="max-w-4xl">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-display text-white mb-3">Simple, Pay-As-You-Go Pricing</h2>
                <p className="text-[var(--text-secondary)]">Buy credits once, use them forever. 1 credit = 3 reply drafts.</p>
            </div>

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
                                <span className="text-4xl font-display font-bold">₦{pack.price.toLocaleString()}</span>
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
                                <li className="flex items-center text-sm text-[var(--text-primary)]">
                                    <svg className="w-5 h-5 text-[var(--success)] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        </Modal>
    );
}
