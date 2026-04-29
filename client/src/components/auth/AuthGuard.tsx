import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { AuthModal } from './AuthModal';
import { Spinner } from '../ui/Spinner';

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, isAuthLoading } = useAuthStore();

    if (isAuthLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size={32} className="text-[var(--accent)]" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
                <AuthModal isOpen={true} />
            </div>
        );
    }

    return <>{children}</>;
}
