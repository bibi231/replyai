import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export function UnifiedFooter() {
    const [isNetworkOpen, setIsNetworkOpen] = useState(false);

    const networkProducts = [
        { name: 'HarvestAI', desc: 'Premium Web Data & Scraping', link: 'https://harvestai-new.vercel.app', icon: '🌾' },
        { name: 'Star Ranker', desc: 'Entertainment Analytics & PR', link: '#', icon: '⭐' },
        { name: 'SafeNet', desc: 'Digital Security & Fraud Protection', link: '#', icon: '🛡️' },
        { name: 'Sonic Phil.', desc: 'Music, Philosophy & Art', link: '#', icon: '🎵' },
    ];

    return (
        <footer className="unified-footer">
            {/* External Ad Slot (PropellerAds/AdSense) */}
            <div className="external-ad-slot top-footer-ad">
                <div className="ad-placeholder">
                    <span>Sponsored Content</span>
                    <p>Space for Google AdSense / PropellerAds Banner (728x90)</p>
                </div>
            </div>

            <div className="footer-main">
                <div className="footer-grid">
                    <div className="footer-col brand">
                        <div className="footer-logo-v2">ReplyAI</div>
                        <p className="footer-about">
                            The intelligent layer for your professional inbox. 
                            Built in Abuja, refined for the world by <strong>TrueWeb Solutions</strong>.
                        </p>
                        <div className="social-links-v2">
                            <a href="#" className="social-icon">𝕏</a>
                            <a href="#" className="social-icon">In</a>
                            <a href="#" className="social-icon">IG</a>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4>Platform</h4>
                        <Link to="/app">AI Generator</Link>
                        <Link to="/dashboard">Reply History</Link>
                        <Link to="/pricing">Pricing Plans</Link>
                        <Link to="/settings">Account Settings</Link>
                    </div>

                    <div className="footer-col">
                        <h4>Resources</h4>
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms of Service</Link>
                        <Link to="/refund">Refund Policy</Link>
                        <Link to="/cookies">Cookie Settings</Link>
                    </div>

                    <div className="footer-col">
                        <h4>Support</h4>
                        <a href="mailto:support@trueweb.solutions">Help Center</a>
                        <a href="mailto:support@trueweb.solutions">Contact Sales</a>
                        <div className="trust-badge">
                            <span className="secure-icon">🛡️</span>
                            Verified by TrueWeb Network
                        </div>
                    </div>
                </div>
            </div>

            {/* Network Toggle Area */}
            <div className="footer-bottom-bar">
                <div className="footer-bottom-inner">
                    <div 
                        className={`network-trigger-v2 ${isNetworkOpen ? 'is-active' : ''}`}
                        onClick={() => setIsNetworkOpen(!isNetworkOpen)}
                    >
                        <span className="flag-icon">🇳🇬</span>
                        <span className="trigger-text">A TrueWeb Solutions Product</span>
                        <svg 
                            className="chevron-icon" 
                            width="14" 
                            height="14" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2.5"
                            style={{ transform: isNetworkOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
                        >
                            <path d="M18 15l-6-6-6 6" />
                        </svg>
                    </div>

                    <div className="footer-meta-text">
                        © 2026 TrueWeb Solutions. All rights reserved.
                    </div>
                </div>

                {/* Interactive Network Slider */}
                <div className={`network-slider-overlay ${isNetworkOpen ? 'is-open' : ''}`}>
                    <div className="network-slider-content">
                        <div className="slider-header">
                            <h3>TrueWeb Ecosystem</h3>
                            <button onClick={() => setIsNetworkOpen(false)} className="close-slider">✕</button>
                        </div>
                        <div className="product-grid-v2">
                            {networkProducts.map(p => (
                                <a key={p.name} href={p.link} className="product-card-v2" target="_blank" rel="noopener noreferrer">
                                    <span className="p-icon">{p.icon}</span>
                                    <div className="p-info">
                                        <span className="p-name">{p.name}</span>
                                        <span className="p-desc">{p.desc}</span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
