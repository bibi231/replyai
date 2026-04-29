import { create } from 'zustand';
export const useAuthStore = create((set) => ({
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
