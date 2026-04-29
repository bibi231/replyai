import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';

const ADS = [
    {
        title: "Go Pro for ₦3,500",
        desc: "Get 100 replies and never worry about limits again.",
        cta: "Upgrade Now",
        link: "/pricing"
    },
    {
        title: "ReplyAI for Teams",
        desc: "Standardize communication across your whole office.",
        cta: "Contact Sales",
        link: "mailto:hello@trueweb.ng"
    },
    {
        title: "Pidgin Generation",
        desc: "Now available! Reply like a boss in flawless Pidgin.",
        cta: "Try it out",
        link: "/app"
    }
];

export function ReplyAIAd() {
    const { credits } = useAuthStore();
    const [adIdx, setAdIdx] = useState(0);

    // Only show for free users (no paid credits)
    if (credits && credits.paid > 0) return null;

    useEffect(() => {
        const interval = setInterval(() => {
            setAdIdx((prev) => (prev + 1) % ADS.length);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    const ad = ADS[adIdx];

    return (
        <div className="ad-container">
            <div className="ad-badge">SPONSORED</div>
            <div className="ad-content">
                <div className="ad-title">{ad.title}</div>
                <div className="ad-desc">{ad.desc}</div>
                <a href={ad.link} className="ad-cta">{ad.cta} →</a>
            </div>
        </div>
    );
}
