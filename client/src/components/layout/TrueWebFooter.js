import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
const NETWORK_LINKS = [
    { name: 'Star Ranker', url: 'https://starranker.trueweb.ng', desc: 'AI SEO Optimization' },
    { name: 'SafeNet', url: 'https://safenet.trueweb.ng', desc: 'Cybersecurity for Africa' },
    { name: 'Pulse', url: 'https://pulse.trueweb.ng', desc: 'Real-time Analytics' },
    { name: 'TrueWeb', url: 'https://trueweb.ng', desc: 'Parent Company' }
];
export function TrueWebFooter() {
    const [isExpanded, setIsExpanded] = useState(false);
    return (_jsx("footer", { className: `tw-footer ${isExpanded ? 'is-expanded' : ''}`, children: _jsxs("div", { className: "tw-footer-inner", children: [_jsxs("div", { className: "tw-footer-left", children: [_jsx("span", { className: "tw-brand", children: "TrueWeb Technologies Network" }), _jsx("span", { className: "tw-copy", children: "\u00A9 2026 \u00B7 Abuja, Nigeria" })] }), _jsxs("div", { className: "tw-footer-right", children: [_jsxs("button", { className: "tw-toggle", onClick: () => setIsExpanded(!isExpanded), children: [isExpanded ? 'Hide Network' : 'Browse Network', _jsx("svg", { className: "tw-icon", width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: _jsx("path", { d: isExpanded ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6" }) })] }), _jsx("div", { className: "tw-network-grid", children: NETWORK_LINKS.map(link => (_jsxs("a", { href: link.url, target: "_blank", rel: "noopener noreferrer", className: "tw-network-link", children: [_jsx("span", { className: "tw-link-name", children: link.name }), _jsx("span", { className: "tw-link-desc", children: link.desc })] }, link.name))) })] })] }) }));
}
