import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
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
    if (credits && credits.paid > 0)
        return null;
    useEffect(() => {
        const interval = setInterval(() => {
            setAdIdx((prev) => (prev + 1) % ADS.length);
        }, 8000);
        return () => clearInterval(interval);
    }, []);
    const ad = ADS[adIdx];
    return (_jsxs("div", { className: "ad-container", children: [_jsx("div", { className: "ad-badge", children: "SPONSORED" }), _jsxs("div", { className: "ad-content", children: [_jsx("div", { className: "ad-title", children: ad.title }), _jsx("div", { className: "ad-desc", children: ad.desc }), _jsxs("a", { href: ad.link, className: "ad-cta", children: [ad.cta, " \u2192"] })] })] }));
}
