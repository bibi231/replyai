import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export function UnifiedFooter() {
    const [isNetworkOpen, setIsNetworkOpen] = useState(false);

    const networkProducts = [
        { name: 'HarvestAI', desc: 'Premium Web Data & Scraping', link: 'https://harvestai.com.ng', icon: '🌾' },
        { name: 'Star Ranker', desc: 'Entertainment Analytics & PR', link: '#', icon: '⭐' },
        { name: 'SafeNet', desc: 'Digital Security & Fraud Protection', link: '#', icon: '🛡️' },
        { name: 'Sonic Phil.', desc: 'Music, Philosophy & Art', link: '#', icon: '🎵' },
    ];

    return (
        <footer className="unified-footer">
            {/* Top-level Ad Slot */}
            <div className="external-ad-slot">
                <div className="ad-placeholder">
                    <span>Sponsored Content</span>
                    <p>Google AdSense / PropellerAds Placement (728x90)</p>
                </div>
            </div>

            <div className="footer-main">
                <div className="footer-grid">
                    {/* Brand Info */}
                    <div className="footer-col brand">
                        <Link to="/" className="footer-logo-v2">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ color: 'var(--accent)' }}>
                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                            </svg>
                            ReplyAI
                        </Link>
                        <p className="footer-about">
                            Professional AI-powered email replies for the modern Nigerian workspace. 
                            Build better relationships with every click.
                        </p>
                        <div className="social-links-v2">
                            <a href="#" className="social-icon" title="Twitter (X)">𝕏</a>
                            <a href="#" className="social-icon" title="LinkedIn">In</a>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="footer-col">
                        <h4>Platform</h4>
                        <Link to="/pricing">Pricing</Link>
                        <Link to="/app">Generator</Link>
                        <Link to="/dashboard">Dashboard</Link>
                    </div>

                    {/* Legal */}
                    <div className="footer-col">
                        <h4>Legal</h4>
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms of Service</Link>
                        <Link to="/refund">Refund Policy</Link>
                        <Link to="/cookies">Cookies</Link>
                    </div>

                    {/* Status & Badge */}
                    <div className="footer-col items-center">
                        <h4>Presence</h4>
                        <p className="footer-about" style={{ marginBottom: 12 }}>
                           A <strong>TrueWeb Solutions</strong> Product.<br/>
                           Abuja, Nigeria 🇳🇬
                        </p>
                        <div className="trust-badge">
                            <span className="secure-icon">🛡️</span>
                            Secured by TrueWeb Network
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar & Network Toggle */}
            <div className="footer-bottom-bar">
                <div className="footer-bottom-inner">
                    <div className="footer-meta-text">
                        © 2026 ReplyAI. All rights reserved.
                    </div>
                    
                    <div 
                        className={`network-trigger-v2 ${isNetworkOpen ? 'is-active' : ''}`}
                        onClick={() => setIsNetworkOpen(!isNetworkOpen)}
                    >
                        <span className="flag-icon">⚡</span>
                        <span className="trigger-text">TrueWeb Network</span>
                        <svg 
                            className="chevron-icon" 
                            width="14" 
                            height="14" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2.5"
                            style={{ transform: isNetworkOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
                        >
                            <path d="M18 15l-6-6-6 6" />
                        </svg>
                    </div>
                </div>

                {/* Animated Network Slider Overlay */}
                <div className={`network-slider-overlay ${isNetworkOpen ? 'is-open' : ''}`}>
                    <div className="network-slider-content">
                        <div className="slider-header">
                            <div>
                                <h3>TrueWeb Network</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Pushing the boundaries of African AI.</p>
                            </div>
                            <button onClick={() => setIsNetworkOpen(false)} className="close-slider">✕</button>
                        </div>
                        
                        <div className="product-grid-v2">
                            {networkProducts.map(p => (
                                <a key={p.name} href={p.link} className="product-card-v2" target="_blank" rel="noopener noreferrer">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                        <span className="p-icon">{p.icon}</span>
                                        <span style={{ color: 'var(--accent)', fontSize: 18 }}>→</span>
                                    </div>
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
