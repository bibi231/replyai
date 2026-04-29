import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import { api } from '../lib/api';
export function useAuth() {
    const { setUser, setCredits, setAuthLoading, openPricing } = useAuthStore();
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const res = await api.post('/api/auth/sync', {
                        displayName: user.displayName,
                        photoUrl: user.photoURL
                    });
                    setCredits({
                        free: res.data.credits.freeRemaining,
                        paid: res.data.credits.paidCredits,
                        canGenerate: res.data.credits.canGenerate,
                        resetDate: res.data.credits.resetDate
                    });
                }
                catch (e) {
                    console.error("Auth sync error", e);
                }
            }
            else {
                setCredits(null);
            }
            setUser(user);
            setAuthLoading(false);
        });
        const triggerPricing = () => openPricing();
        window.addEventListener('insufficient-credits', triggerPricing);
        return () => {
            unsubscribe();
            window.removeEventListener('insufficient-credits', triggerPricing);
        };
    }, [setUser, setCredits, setAuthLoading, openPricing]);
}
