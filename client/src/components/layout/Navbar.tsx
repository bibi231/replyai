import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { logOut } from '../../lib/firebase';

export function Navbar() {
    const user = useAuthStore(s => s.user);
    const credits = useAuthStore(s => s.credits);
    const { pathname } = useLocation();

    const freeLeft = credits?.free ?? 0;
    const paidLeft = credits?.paid ?? 0;
    const hasCredits = freeLeft > 0 || paidLeft > 0;

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="navbar-logo">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    ReplyAI
                </Link>

                <div className="navbar-right">
                    {user && credits && (
                        <Link to="/pricing" className={`credits-badge-link ${!hasCredits ? 'empty' : freeLeft > 0 ? 'free' : 'paid'}`}>
                            <span className={`credits-badge-dot ${!hasCredits ? 'pulse-red' : ''}`} />
                            {freeLeft > 0
                                ? `${freeLeft} free ${freeLeft === 1 ? 'reply' : 'replies'} left`
                                : paidLeft > 0
                                    ? `${paidLeft} credits`
                                    : 'No credits'}
                        </Link>
                    )}
                    {user && (
                        <>
                            <Link to="/app" className={`navbar-link ${pathname === '/app' ? 'active' : ''}`}>Generator</Link>
                            <Link to="/dashboard" className={`navbar-link ${pathname === '/dashboard' ? 'active' : ''}`}>History</Link>
                            <button className="navbar-signout" onClick={logOut}>Sign out</button>
                        </>
                    )}
                    {!user && (
                        <Link to="/app" className="navbar-signin">Sign in</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
