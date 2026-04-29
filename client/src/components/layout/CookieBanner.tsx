import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('replyai_cookie_consent');
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('replyai_cookie_consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="cookie-banner">
            <div className="cookie-inner">
                <div className="cookie-text">
                    <p>
                        We use cookies to enhance your experience and secure your account. 
                        By continuing to use ReplyAI, you agree to our <Link to="/cookies">Cookies Policy</Link>.
                    </p>
                </div>
                <div className="cookie-actions">
                    <button className="btn-secondary btn-sm" onClick={() => setIsVisible(false)}>Decline</button>
                    <button className="btn-primary btn-sm" onClick={handleAccept}>Accept All</button>
                </div>
            </div>
        </div>
    );
}
