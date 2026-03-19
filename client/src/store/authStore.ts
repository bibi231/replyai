import { create } from 'zustand';
import { User } from 'firebase/auth';

interface AuthStore {
    user: User | null;
    credits: {
        free: number;
        paid: number;
        canGenerate: boolean;
        resetDate: string | null;
    } | null;
    isAuthLoading: boolean;
    isPricingOpen: boolean;
    setUser: (user: User | null) => void;
    setCredits: (credits: AuthStore['credits']) => void;
    setAuthLoading: (v: boolean) => void;
    openPricing: () => void;
    closePricing: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    credits: null,
    isAuthLoading: true,
    isPricingOpen: false,
    setUser: (user) => set({ user }),
    setCredits: (credits) => set({ credits }),
    setAuthLoading: (isAuthLoading) => set({ isAuthLoading }),
    openPricing: () => set({ isPricingOpen: true }),
    closePricing: () => set({ isPricingOpen: false }),
}));
