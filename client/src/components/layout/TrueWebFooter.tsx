import React, { useState } from 'react';

const NETWORK_LINKS = [
    { name: 'Star Ranker', url: 'https://starranker.trueweb.ng', desc: 'AI SEO Optimization' },
    { name: 'SafeNet', url: 'https://safenet.trueweb.ng', desc: 'Cybersecurity for Africa' },
    { name: 'Pulse', url: 'https://pulse.trueweb.ng', desc: 'Real-time Analytics' },
    { name: 'TrueWeb', url: 'https://trueweb.ng', desc: 'Parent Company' }
];

export function TrueWebFooter() {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <footer className={`tw-footer ${isExpanded ? 'is-expanded' : ''}`}>
            <div className="tw-footer-inner">
                <div className="tw-footer-left">
                    <span className="tw-brand">TrueWeb Technologies Network</span>
                    <span className="tw-copy">© 2026 · Abuja, Nigeria</span>
                </div>

                <div className="tw-footer-right">
                    <button 
                        className="tw-toggle" 
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? 'Hide Network' : 'Browse Network'}
                        <svg className="tw-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d={isExpanded ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"} />
                        </svg>
                    </button>
                    <div className="tw-network-grid">
                        {NETWORK_LINKS.map(link => (
                            <a 
                                key={link.name} 
                                href={link.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="tw-network-link"
                            >
                                <span className="tw-link-name">{link.name}</span>
                                <span className="tw-link-desc">{link.desc}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
