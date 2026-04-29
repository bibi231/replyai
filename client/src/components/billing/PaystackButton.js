import { jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from '../ui/Button';
import { CREDIT_PACKS } from '../../types';
import { api } from '../../lib/api';
import { openPaystackPopup } from '../../lib/paystack';
import { useCredits } from '../../hooks/useCredits';
import { toast } from '../ui/Toast';
import { useAuthStore } from '../../store/authStore';
export function PaystackButton({ packId, className, onSuccess }) {
    const [isLoading, setIsLoading] = useState(false);
    const { refreshCredits } = useCredits();
    const closePricing = useAuthStore(s => s.closePricing);
    const pack = CREDIT_PACKS.find(p => p.id === packId);
    const handlePurchase = async () => {
        if (!pack)
            return;
        setIsLoading(true);
        try {
            const res = await api.post('/api/credits/initiate-purchase', { pack: pack.id });
            const { reference, amount, email } = res.data;
            openPaystackPopup({
                reference,
                email,
                amount,
                onSuccess: async (ref) => {
                    setTimeout(async () => {
                        await refreshCredits();
                        toast('Credits added! 🎉', 'success');
                        closePricing();
                        if (onSuccess)
                            onSuccess();
                        setIsLoading(false);
                    }, 2000);
                },
                onClose: () => {
                    setIsLoading(false);
                }
            });
        }
        catch (err) {
            console.error(err);
            toast('Failed to initiate payment', 'error');
            setIsLoading(false);
        }
    };
    return (_jsxs(Button, { onClick: handlePurchase, isLoading: isLoading, className: className, variant: pack?.popular ? 'primary' : 'ghost', children: ["Buy \u20A6", pack?.price.toLocaleString()] }));
}
