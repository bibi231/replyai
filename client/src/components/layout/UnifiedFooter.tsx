import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NETWORK_LINKS = [
    { name: 'HarvestAI', url: 'https://harvest.trueweb.tech', desc: 'AI Data Intelligence' },
    { name: 'Star Ranker', url: 'https://starranker.trueweb.tech', desc: 'AI SEO Optimization' },
    { name: 'SafeNet', url: 'https://safenet.trueweb.tech', desc: 'Cybersecurity Suite' },
    { name: 'TrueWeb', url: 'https://trueweb.tech', desc: 'Parent Network' }
];

export function UnifiedFooter() {
    const [isNetworkOpen, setIsNetworkOpen] = useState(false);

    return (
        <footer className="unified-footer">
            {/* Main Product Footer */}
            <div className="product-footer">
                <div className="footer-container">
                    <div className="footer-brand-section">
                        <div className="footer-logo">ReplyAI</div>
                        <p className="footer-tagline">Professional AI-powered email replies for the modern Nigerian workspace.</p>
                    </div>

                    <div className="footer-links-grid">
                        <div className="footer-group">
                            <h4>Platform</h4>
                            <Link to="/pricing">Pricing</Link>
                            <Link to="/app">Generator</Link>
                            <Link to="/dashboard">Dashboard</Link>
                        </div>
                        <div className="footer-group">
                            <h4>Legal</h4>
                            <Link to="/privacy">Privacy Policy</Link>
                            <Link to="/terms">Terms of Service</Link>
                            <Link to="/refund">Refund Policy</Link>
                            <Link to="/cookies">Cookies</Link>
                        </div>
                        <div className="footer-group">
                            <h4>Connect</h4>
                            <a href="https://twitter.com/trueweb_tech" target="_blank" rel="noreferrer">Twitter (X)</a>
                            <a href="https://linkedin.com/company/trueweb" target="_blank" rel="noreferrer">LinkedIn</a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="footer-container">
                        <div 
                            className="footer-network-trigger"
                            onClick={() => setIsNetworkOpen(!isNetworkOpen)}
                        >
                            <span className="trigger-text">A TrueWeb Solutions Product · Abuja, Nigeria 🇳🇬</span>
                            <svg className={`trigger-icon ${isNetworkOpen ? 'is-open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M18 15l-6-6-6 6" />
                            </svg>
                        </div>
                        <div className="footer-copyright">
                            © 2026 ReplyAI. All rights reserved.
                        </div>
                    </div>
                </div>
            </div>

            {/* Network Slider Menu */}
            <div className={`network-slider ${isNetworkOpen ? 'is-active' : ''}`}>
                <div className="network-slider-header">
                    <h3>TrueWeb Network</h3>
                    <button className="network-close" onClick={() => setIsNetworkOpen(false)}>×</button>
                </div>
                <div className="network-slider-grid">
                    {NETWORK_LINKS.map(link => (
                        <a 
                            key={link.name} 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="network-item"
                        >
                            <div className="network-item-name">{link.name}</div>
                            <div className="network-item-desc">{link.desc}</div>
                            <div className="network-item-arrow">→</div>
                        </a>
                    ))}
                </div>
                <div className="network-slider-footer">
                    Pushing the boundaries of African AI.
                </div>
            </div>
            
            {/* Overlay for network slider */}
            {isNetworkOpen && <div className="network-overlay" onClick={() => setIsNetworkOpen(false)} />}
        </footer>
    );
}
