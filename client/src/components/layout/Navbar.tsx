import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { CreditsBadge } from '../billing/CreditsBadge';
import { logOut } from '../../lib/firebase';

export function Navbar() {
    const user = useAuthStore(s => s.user);

    return (
        <nav className="h-16 border-b border-[var(--border)] bg-[var(--bg-primary)]/80 backdrop-blur-md sticky top-0 z-40 flex items-center px-6 justify-between">
            <div className="flex items-center gap-8">
                <Link to={user ? "/app" : "/"} className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[var(--accent)] to-[#a8a4ff] flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(108,99,255,0.4)] group-hover:scale-105 transition-transform">
                        R
                    </div>
                    <span className="font-display font-bold text-xl tracking-tight">Reply<span className="text-[var(--accent)]">AI</span></span>
                </Link>
                <div className="hidden md:flex items-center gap-6">
                    {user && <Link to="/dashboard" className="text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-colors">History</Link>}
                    <Link to="/pricing" className="text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-colors">Pricing</Link>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        <CreditsBadge />
                        <button onClick={logOut} className="text-sm font-medium text-[var(--text-secondary)] hover:text-red-400 transition-colors ml-2 hidden sm:block">
                            Sign Out
                        </button>
                    </>
                ) : (
                    <Link to="/app" className="text-sm font-medium hover:text-white transition-colors py-2 px-4 rounded-full bg-white text-black hover:bg-gray-200">
                        Sign in
                    </Link>
                )}
            </div>
        </nav>
    );
}
