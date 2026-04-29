import { useAuthStore } from '../store/authStore';
import { api } from '../lib/api';
export function useCredits() {
    const credits = useAuthStore((s) => s.credits);
    const setCredits = useAuthStore((s) => s.setCredits);
    const refreshCredits = async () => {
        try {
            const res = await api.get('/api/credits');
            setCredits({
                free: res.data.freeRemaining,
                paid: res.data.paidCredits,
                canGenerate: res.data.canGenerate,
                resetDate: res.data.resetDate
            });
        }
        catch (e) {
            console.error(e);
        }
    };
    return { credits, refreshCredits };
}
