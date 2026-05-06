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
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
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
                    
                    <Link to="/pricing" className={`navbar-link ${pathname === '/pricing' ? 'active' : ''}`}>Pricing</Link>
                    
                    {user ? (
                        <>
                            <Link to="/app" className={`navbar-link ${pathname === '/app' ? 'active' : ''}`}>Generator</Link>
                            <Link to="/dashboard" className={`navbar-link ${pathname === '/dashboard' ? 'active' : ''}`}>History</Link>
                            <Link to="/settings" className={`navbar-link ${pathname === '/settings' ? 'active' : ''}`}>Settings</Link>
                            <Link to="/settings" className="navbar-settings-icon" aria-label="Settings" title="Settings">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                                </svg>
                            </Link>
                            <button className="navbar-signout" onClick={logOut}>Sign out</button>
                        </>
                    ) : (
                        <>
                            <Link to="/app" className="navbar-signin">Sign in</Link>
                            <Link to="/app" className="navbar-cta-small">Try Generator</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
