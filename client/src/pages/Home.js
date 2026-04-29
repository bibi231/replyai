import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
const HEADLINE_WORDS = ['replies', 'responses', 'follow-ups', 'apologies', 'proposals'];
const CHROME_STORE_URL = 'https://chrome.google.com/webstore';
export function Home() {
    const [wordIdx, setWordIdx] = useState(0);
    const [displayed, setDisplayed] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const tickRef = useRef(undefined);
    useEffect(() => {
        const word = HEADLINE_WORDS[wordIdx];
        const speed = isDeleting ? 60 : 100;
        tickRef.current = window.setTimeout(() => {
            if (!isDeleting) {
                if (displayed.length < word.length) {
                    setDisplayed(word.slice(0, displayed.length + 1));
                }
                else {
                    setTimeout(() => setIsDeleting(true), 1800);
                }
            }
            else {
                if (displayed.length > 0) {
                    setDisplayed(displayed.slice(0, -1));
                }
                else {
                    setIsDeleting(false);
                    setWordIdx((i) => (i + 1) % HEADLINE_WORDS.length);
                }
            }
        }, speed);
        return () => clearTimeout(tickRef.current);
    }, [displayed, isDeleting, wordIdx]);
    return (_jsxs("div", { className: "home", children: [_jsx("nav", { className: "home-nav", children: _jsxs("div", { className: "home-nav-inner", children: [_jsxs(Link, { to: "/", className: "nav-logo", children: [_jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: _jsx("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }) }), "ReplyAI"] }), _jsxs("div", { className: "nav-links", children: [_jsx(Link, { to: "/pricing", className: "nav-link", children: "Pricing" }), _jsx(Link, { to: "/dashboard", className: "nav-link", children: "Dashboard" }), _jsx(Link, { to: "/app", className: "nav-cta", children: "Get started" })] })] }) }), _jsxs("section", { className: "hero", children: [_jsxs("div", { className: "hero-bg", "aria-hidden": true, children: [_jsx("div", { className: "hero-glow" }), _jsx("div", { className: "hero-grid" })] }), _jsxs("div", { className: "hero-content", children: [_jsxs("div", { className: "hero-badge", children: [_jsx("span", { className: "hero-badge-dot" }), "Free to install \u00B7 5 replies/month free"] }), _jsxs("h1", { className: "hero-headline", children: ["Write better email", ' ', _jsxs("span", { className: "hero-rotating-word", children: [displayed, _jsx("span", { className: "hero-cursor", children: "|" })] }), _jsx("br", {}), "in seconds."] }), _jsxs("p", { className: "hero-sub", children: ["ReplyAI lives inside Gmail. Open any email, click one button, get 3 AI-written drafts tailored to your tone. Support for ", _jsx("b", { children: "English, Pidgin, Yoruba, Hausa & French" }), ". Built for Nigerian professionals by TrueWeb Technologies."] }), _jsxs("div", { className: "hero-actions", children: [_jsxs(Link, { to: "/app", className: "hero-cta-primary", children: [_jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: _jsx("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }) }), "Try it free"] }), _jsx(Link, { to: "/pricing", className: "hero-cta-secondary", children: "See pricing" })] }), _jsx("div", { className: "hero-stats", children: [
                                    { value: '5', label: 'Free replies monthly' },
                                    { value: '3s', label: 'Avg generation time' },
                                    { value: '3', label: 'Drafts per click' },
                                ].map((s) => (_jsxs("div", { className: "hero-stat", children: [_jsx("span", { className: "hero-stat-value", children: s.value }), _jsx("span", { className: "hero-stat-label", children: s.label })] }, s.label))) })] }), _jsxs("div", { className: "hero-demo", "aria-hidden": true, children: [_jsxs("div", { className: "demo-email-card", children: [_jsxs("div", { className: "demo-email-header", children: [_jsx("div", { className: "demo-avatar", children: "C" }), _jsxs("div", { children: [_jsx("div", { className: "demo-sender", children: "Chidi Okonkwo" }), _jsx("div", { className: "demo-subject", children: "Re: Invoice #2024-047 \u2014 Overdue" })] })] }), _jsx("p", { className: "demo-body", children: "Hello, I'm writing to follow up on the outstanding payment of \u20A6350,000 for the website redesign. It's been 3 weeks past the due date..." }), _jsxs("div", { className: "demo-reply-btn", children: [_jsx("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: _jsx("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }) }), "ReplyAI"] })] }), _jsxs("div", { className: "demo-panel-card", children: [_jsxs("div", { className: "demo-panel-header", children: [_jsx("span", { children: "Professional" }), _jsx("span", { className: "demo-credits", children: "4 free left" })] }), [
                                        { label: 'Short & direct', preview: 'Thank you for following up. I apologise for the delay — payment will be processed by...' },
                                        { label: 'Warm & detailed', preview: 'I appreciate your patience regarding invoice #2047. I can confirm that the payment...' },
                                    ].map((d) => (_jsxs("div", { className: "demo-draft", children: [_jsx("span", { className: "demo-draft-label", children: d.label }), _jsx("p", { className: "demo-draft-text", children: d.preview }), _jsx("button", { className: "demo-insert-btn", children: "Insert into Gmail" })] }, d.label)))] })] })] }), _jsx("section", { className: "section", children: _jsxs("div", { className: "section-inner", children: [_jsx("div", { className: "section-label", children: "How it works" }), _jsx("h2", { className: "section-title", children: "Three clicks. Zero effort." }), _jsx("div", { className: "steps-grid", children: [
                                { step: '01', title: 'Install the extension', desc: 'Add ReplyAI to Chrome in 10 seconds. Sign in with Google. Done.' },
                                { step: '02', title: 'Open any email', desc: 'Visit Gmail. Open an email you need to reply to. The ⚡ ReplyAI button appears automatically.' },
                                { step: '03', title: 'Pick a draft and insert', desc: 'Choose Professional, Friendly, Firm, or Custom. Click Generate. Pick the best draft and insert it directly into Gmail.' },
                            ].map((s) => (_jsxs("div", { className: "step-card", children: [_jsx("div", { className: "step-number", children: s.step }), _jsx("h3", { className: "step-title", children: s.title }), _jsx("p", { className: "step-desc", children: s.desc })] }, s.step))) })] }) }), _jsx("section", { className: "section section-alt", children: _jsxs("div", { className: "section-inner", children: [_jsx("div", { className: "section-label", children: "Multilingual Support" }), _jsx("h2", { className: "section-title", children: "Reply in the way they understand." }), _jsx("div", { className: "langs-grid", children: [
                                { name: 'English', icon: '🇬🇧', desc: 'Global standards for professional outreach.' },
                                { name: 'Pidgin', icon: '🇳🇬', desc: 'Perfect for that "street" or casual Lagos vibe.' },
                                { name: 'Yoruba', icon: '🇳🇬', desc: 'Respectful and culturally aligned responses.' },
                                { name: 'Hausa', icon: '🇳🇬', desc: 'Formal and business-ready Northern dialects.' },
                                { name: 'French', icon: '🇫🇷', desc: 'Connect with our Francophone neighbors seamlessly.' }
                            ].map(l => (_jsxs("div", { className: "lang-feature-card", children: [_jsx("span", { className: "lang-icon", children: l.icon }), _jsx("h3", { children: l.name }), _jsx("p", { children: l.desc })] }, l.name))) })] }) }), _jsx("section", { className: "section", children: _jsxs("div", { className: "section-inner section-center", children: [_jsx("div", { className: "section-label", children: "Pricing" }), _jsx("h2", { className: "section-title", children: "Start free. Pay as you grow." }), _jsx("p", { className: "section-sub", children: "5 free AI replies every month. No credit card needed to start." }), _jsx(Link, { to: "/pricing", className: "hero-cta-secondary", style: { display: 'inline-flex', marginTop: 24 }, children: "See all plans \u2192" })] }) }), _jsx("section", { className: "section section-cta", children: _jsxs("div", { className: "section-inner section-center", children: [_jsx("h2", { className: "cta-headline", children: "Ready to stop dreading your inbox?" }), _jsx("p", { className: "section-sub", children: "Join professionals across Nigeria who already use ReplyAI." }), _jsx(Link, { to: "/app", className: "hero-cta-primary", style: { marginTop: 28 }, children: "Try ReplyAI \u2014 Free" })] }) }), _jsx("footer", { className: "home-footer", children: _jsxs("div", { className: "footer-inner", children: [_jsx("div", { className: "footer-logo", children: "ReplyAI" }), _jsxs("div", { className: "footer-links", children: [_jsx(Link, { to: "/pricing", children: "Pricing" }), _jsx(Link, { to: "/dashboard", children: "Dashboard" }), _jsx(Link, { to: "/privacy", children: "Privacy" }), _jsx(Link, { to: "/terms", children: "Terms" })] }), _jsx("div", { className: "footer-copy", children: "A TrueWeb Technologies Product \u00B7 Abuja, Nigeria \uD83C\uDDF3\uD83C\uDDEC" })] }) })] }));
}
