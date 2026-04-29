import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const HEADLINE_WORDS = ['replies', 'responses', 'follow-ups', 'apologies', 'proposals'];
const CHROME_STORE_URL = 'https://chrome.google.com/webstore';

export function Home() {
  const [wordIdx, setWordIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const tickRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const word = HEADLINE_WORDS[wordIdx];
    const speed = isDeleting ? 60 : 100;

    tickRef.current = window.setTimeout(() => {
      if (!isDeleting) {
        if (displayed.length < word.length) {
          setDisplayed(word.slice(0, displayed.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 1800);
        }
      } else {
        if (displayed.length > 0) {
          setDisplayed(displayed.slice(0, -1));
        } else {
          setIsDeleting(false);
          setWordIdx((i) => (i + 1) % HEADLINE_WORDS.length);
        }
      }
    }, speed);

    return () => clearTimeout(tickRef.current);
  }, [displayed, isDeleting, wordIdx]);

  return (
    <div className="home">
      {/* Navbar */}
      <nav className="home-nav">
        <div className="home-nav-inner">
          <Link to="/" className="nav-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            ReplyAI
          </Link>
          <div className="nav-links">
            <Link to="/pricing" className="nav-link">Pricing</Link>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/app" className="nav-cta">Get started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" aria-hidden>
          <div className="hero-glow" />
          <div className="hero-grid" />
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Free to install · 5 replies/month free
          </div>

          <h1 className="hero-headline">
            Write better email{' '}
            <span className="hero-rotating-word">
              {displayed}
              <span className="hero-cursor">|</span>
            </span>
            <br />
            in seconds.
          </h1>

          <p className="hero-sub">
            ReplyAI lives inside Gmail. Open any email, click one button,
            get 3 AI-written drafts tailored to your tone. Support for <b>English, Pidgin, Yoruba, Hausa & French</b>. 
            Built for Nigerian professionals by TrueWeb Technologies.
          </p>

          <div className="hero-actions">
            <Link to="/app" className="hero-cta-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              Try it free
            </Link>
            <Link to="/pricing" className="hero-cta-secondary">
              See pricing
            </Link>
          </div>

          <div className="hero-stats">
            {[
              { value: '5', label: 'Free replies monthly' },
              { value: '3s', label: 'Avg generation time' },
              { value: '3', label: 'Drafts per click' },
            ].map((s) => (
              <div key={s.label} className="hero-stat">
                <span className="hero-stat-value">{s.value}</span>
                <span className="hero-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating demo mockup */}
        <div className="hero-demo" aria-hidden>
          <div className="demo-email-card">
            <div className="demo-email-header">
              <div className="demo-avatar">C</div>
              <div>
                <div className="demo-sender">Chidi Okonkwo</div>
                <div className="demo-subject">Re: Invoice #2024-047 — Overdue</div>
              </div>
            </div>
            <p className="demo-body">
              Hello, I'm writing to follow up on the outstanding payment of ₦350,000 for the website redesign. It's been 3 weeks past the due date...
            </p>
            <div className="demo-reply-btn">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              ReplyAI
            </div>
          </div>

          <div className="demo-panel-card">
            <div className="demo-panel-header">
              <span>Professional</span>
              <span className="demo-credits">4 free left</span>
            </div>
            {[
              { label: 'Short & direct', preview: 'Thank you for following up. I apologise for the delay — payment will be processed by...' },
              { label: 'Warm & detailed', preview: 'I appreciate your patience regarding invoice #2047. I can confirm that the payment...' },
            ].map((d) => (
              <div key={d.label} className="demo-draft">
                <span className="demo-draft-label">{d.label}</span>
                <p className="demo-draft-text">{d.preview}</p>
                <button className="demo-insert-btn">Insert into Gmail</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section">
        <div className="section-inner">
          <div className="section-label">How it works</div>
          <h2 className="section-title">Three clicks. Zero effort.</h2>
          <div className="steps-grid">
            {[
              { step: '01', title: 'Install the extension', desc: 'Add ReplyAI to Chrome in 10 seconds. Sign in with Google. Done.' },
              { step: '02', title: 'Open any email', desc: 'Visit Gmail. Open an email you need to reply to. The ⚡ ReplyAI button appears automatically.' },
              { step: '03', title: 'Pick a draft and insert', desc: 'Choose Professional, Friendly, Firm, or Custom. Click Generate. Pick the best draft and insert it directly into Gmail.' },
            ].map((s) => (
              <div key={s.step} className="step-card">
                <div className="step-number">{s.step}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tones section update to include Language highlight */}
      <section className="section section-alt">
        <div className="section-inner">
          <div className="section-label">Multilingual Support</div>
          <h2 className="section-title">Reply in the way they understand.</h2>
          <div className="langs-grid">
            {[
                { name: 'English', icon: '🇬🇧', desc: 'Global standards for professional outreach.' },
                { name: 'Pidgin', icon: '🇳🇬', desc: 'Perfect for that "street" or casual Lagos vibe.' },
                { name: 'Yoruba', icon: '🇳🇬', desc: 'Respectful and culturally aligned responses.' },
                { name: 'Hausa', icon: '🇳🇬', desc: 'Formal and business-ready Northern dialects.' },
                { name: 'French', icon: '🇫🇷', desc: 'Connect with our Francophone neighbors seamlessly.' }
            ].map(l => (
                <div key={l.name} className="lang-feature-card">
                    <span className="lang-icon">{l.icon}</span>
                    <h3>{l.name}</h3>
                    <p>{l.desc}</p>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="section">
        <div className="section-inner section-center">
          <div className="section-label">Pricing</div>
          <h2 className="section-title">Start free. Pay as you grow.</h2>
          <p className="section-sub">5 free AI replies every month. No credit card needed to start.</p>
          <Link to="/pricing" className="hero-cta-secondary" style={{ display: 'inline-flex', marginTop: 24 }}>
            See all plans →
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section section-cta">
        <div className="section-inner section-center">
          <h2 className="cta-headline">Ready to stop dreading your inbox?</h2>
          <p className="section-sub">Join professionals across Nigeria who already use ReplyAI.</p>
          <Link to="/app" className="hero-cta-primary" style={{ marginTop: 28 }}>
            Try ReplyAI — Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-inner">
          <div className="footer-logo">ReplyAI</div>
          <div className="footer-links">
            <Link to="/pricing">Pricing</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
          <div className="footer-copy">A TrueWeb Technologies Product · Abuja, Nigeria 🇳🇬</div>
        </div>
      </footer>
    </div>
  );
}
