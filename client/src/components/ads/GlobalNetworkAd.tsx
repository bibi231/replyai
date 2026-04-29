import React from 'react';

const ADS = [
    {
        id: 'harvest',
        title: 'HarvestAI',
        tagline: 'Precision Data Intelligence',
        desc: 'Extract deep insights from your business data with the power of localized AI models.',
        cta: 'Learn More',
        url: 'https://harvest.trueweb.tech',
        color: '#22c55e'
    },
    {
        id: 'starranker',
        title: 'Star Ranker',
        tagline: 'Dominate Search Rankings',
        desc: 'AI-powered SEO optimization built specifically for the Nigerian digital ecosystem.',
        cta: 'Boost SEO',
        url: 'https://starranker.trueweb.tech',
        color: '#3b82f6'
    }
];

export function GlobalNetworkAd() {
    // Determine which ad to show based on the minute to get a "rotation" effect on every page load/segment
    const ad = ADS[new Date().getMinutes() % ADS.length];

    return (
        <div className="global-ad-banner" style={{ '--ad-accent': ad.color } as React.CSSProperties}>
            <div className="global-ad-container">
                <div className="global-ad-content">
                    <span className="global-ad-badge">TrueWeb Network</span>
                    <h3 className="global-ad-title">
                        {ad.title} — <span className="global-ad-tagline">{ad.tagline}</span>
                    </h3>
                    <p className="global-ad-desc">{ad.desc}</p>
                </div>
                <a href={ad.url} target="_blank" rel="noopener noreferrer" className="global-ad-cta">
                    {ad.cta}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                    </svg>
                </a>
            </div>
        </div>
    );
}
