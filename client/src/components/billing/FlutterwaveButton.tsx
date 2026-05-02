import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { PackType, CREDIT_PACKS } from '../../types';
import { api } from '../../lib/api';
import { useCredits } from '../../hooks/useCredits';
import { toast } from '../ui/Toast';
import { useAuthStore } from '../../store/authStore';

interface FlutterwaveButtonProps {
    packId: PackType;
    className?: string;
    onSuccess?: () => void;
}

declare global {
    interface Window {
        FlutterwaveCheckout: any;
    }
}

export function FlutterwaveButton({ packId, className, onSuccess }: FlutterwaveButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { refreshCredits } = useCredits();
    const closePricing = useAuthStore(s => s.closePricing);

    const pack = CREDIT_PACKS.find(p => p.id === packId);

    const handlePurchase = async () => {
        if (!pack) return;
        setIsLoading(true);
        try {
            // Re-using initiate-purchase for consistency OR dedicated FLW init
            const res = await api.post('/api/credits/initiate-purchase', { 
                pack: pack.id,
                gateway: 'flutterwave',
                currency: 'USD'
            });
            const { reference, amount, email, publicKey } = res.data;

            const FLW_KEY = (import.meta as any).env?.VITE_FLW_PUBLIC_KEY
                || publicKey
                || "FLWPUBK-fd601354d79f90fec8a83d171c88b1dd-X";

            window.FlutterwaveCheckout({
                public_key: FLW_KEY,
                tx_ref: reference,
                amount: amount / 100, // Flutterwave takes regular decimal
                currency: "USD",
                payment_options: "card,mobilemoney,ussd",
                customer: {
                    email: email,
                },
                customizations: {
                    title: "ReplyAI Credits",
                    description: `Payment for ${pack.credits} credits`,
                    logo: "https://trueweb.tech/logo.png",
                },
                callback: (data: any) => {
                    if (data.status === "successful") {
                        setTimeout(async () => {
                            await refreshCredits();
                            toast('Credits added with Flutterwave! 🌍', 'success');
                            closePricing();
                            if (onSuccess) onSuccess();
                            setIsLoading(false);
                        }, 2000);
                    }
                },
                onclose: () => {
                    setIsLoading(false);
                }
            });
        } catch (err) {
            console.error(err);
            toast('Failed to initiate global payment', 'error');
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={handlePurchase}
            isLoading={isLoading}
            className={className}
            varia