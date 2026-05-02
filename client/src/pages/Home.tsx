import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { useAuthStore } from '../store/authStore';

const HEADLINE_WORDS = ['replies', 'responses', 'follow-ups', 'apologies', 'proposals'];

export function Home() {
  const [wordIdx, setWordIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const tickRef = useRef<number | undefined>(undefined);
  
  const [demoIdx, setDemoIdx] = useState(0);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const user = useAuthStore(s => s.user);
  const credits = useAuthStore(s => s.credits);
  const isFreeTier = !credits || (credits.paid === 0);

  const DEMO_EMAILS = [
    { 
      initial: 'C', sender: 'Chidi Okonkwo', subject: 'Re: Invoice #2024-047 — Overdue', 
      body: "Hello, I'm writing to follow up on the outstanding payment of ₦350,000 for the website redesign. It's been 3 weeks past the due date...",
      reply: "I understand the urgency regarding Invoice #2024-047. I've just confirmed with our finance team, and the payment of ₦350,000 has been initiated."
    },
    { 
      initial: 'A', sender: 'Aisha Bello', subject: 'Partnership Proposal: TrueWeb x TechLab', 
      body: "We loved your previous work on SafeNet and would like to invite you for a 6-month partnership involving our data pipeline... are you free?",
      reply: "Thank you for reaching out, Aisha! Your proposal sounds exciting. I've followed TrueWeb's work closely and would love to discuss the TechLab partnership."
    },
    { 
      initial: 'T', sender: 'Tunde Adeyemi', subject: 'Internship Application – Bitrus SIWES', 
      body: "I am writing to apply for the backend engineering internship. I have 2 years experience with Node.js and Drizzle ORM...",
      reply: "Dear Tunde, your experience with Node.js and Drizzle is impressive. We'd like to schedule an interview next week to discuss your role further."
    }
  ];

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

  useEffect(() => {
    if (!isDemoOpen) {
      const interval = setInterval(() => {
        setDemoIdx((i) => (i + 1) % DEMO_EMAILS.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isDemoOpen]);

  const activeDemo = DEMO_EMAILS[demoIdx];

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
    setEmail('');
  };

  return (
    <div className="home">
      <Navbar />

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
            Built for Nigerian professionals by TrueWeb Solutions.
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
            <a
              href="https://chrome.google.com/webstore"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-cta-secondary"
              title="Chrome Extension — coming soon"
              style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: 0.7 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
              Chrome Extension ✦
            </a>
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

        {/* Floating demo mockup - Interactive */}
        <div className="hero-demo" onDoubleClick={() => setIsDemoOpen(true)}>
          <div className={`demo-email-card ${isDemoOpen ? 'minimized' : ''}`}>
            <div className="demo-email-header">
              <div className="demo-avatar">{activeDemo.initial}</div>
              <div className="demo-header-info">
                <div className="demo-sender">{activeDemo.sender}</div>
                <div className="demo-subject">{activeDemo.subject}</div>
              </div>
              {!isDemoOpen && (
                <div className="demo-indicator">Double-click to reply</div>
              )}
            </div>
            <p className="demo-body">{activeDemo.body}</p>
            {!isDemoOpen && (
              <div className="demo-reply-btn" onClick={() => setIsDemoOpen(true)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                Reply with AI
              </div>
            )}
          </div>

          {isDemoOpen ? (
            <div className="demo-whatsapp-ui animate-in">
              <div className="whatsapp-header">
                <div className="whatsapp-back" onClick={() => setIsDemoOpen(false)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                     <polyline points="15 18 9 12 15 6" />
                  </svg>
                </div>
                <div className="whatsapp-user">
                  <div className="whatsapp-avatar">{activeDemo.initial}</div>
                  <div>
                    <div className="whatsapp-name">ReplyAI Assistant</div>
                    <div className="whatsapp-status">Typing drafts...</div>
                  </div>
                </div>
              </div>

              <div className="whatsapp-chat">
                <div className="chat-bubble received">
                  {activeDemo.body}
                </div>
                <div className="chat-bubble sent ai-highlight">
                  {activeDemo.reply}
                </div>
              </div>

              <div className="whatsapp-input-area">
                <div className="whatsapp-attachment">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                </div>
                <div className="whatsapp-input-mock">
                  Choose a tone and generate...
                  <div className="whatsapp-smiley">😊</div>
                </div>
                <div className="whatsapp-mic">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            <div className="demo-panel-card">
              <div className="demo-panel-header">
                <span>Tone: Professional</span>
                <span className="demo-credits">4 free left</span>
              </div>
              <div className="demo-draft active">
                <span className="demo-draft-label">Draft 1</span>
                <p className="demo-draft-text">{activeDemo.reply}</p>
                <button className="demo-insert-btn" onClick={() => setIsDemoOpen(true)}>Open Interaction</button>
              </div>
            </div>
          )}
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

      {/* Newsletter & Sub-CTA */}
      <section className="section section-newsletter">
        <div className="section-inner section-center">
          <div className="newsletter-box">
             <h2 className="newsletter-title">Get the ReplyAI Guide</h2>
             <p className="newsletter-sub">Join 2,000+ Nigerian pros. Monthly tips on writing better emails.</p>
             
             {!isSubscribed ? (
               <form onSubmit={handleNewsletter} className="newsletter-form">
                 <input 
                   type="email" 
                   placeholder="Your email address" 
                   required 
                   value={email}
                   onChange={e => setEmail(e.target.value)}
                   className="newsletter-input"
                 />
                 <button type="submit" className="newsletter-btn">Join</button>
               </form>
             ) : (
               <div className="newsletter-success">🎉 You're on the list! Check your inbox.</div>
             )}

             {/* Ad for non-subscribers/free users */}
             {isFreeTier && (
               <div className="ad-mini-box">
                 <span className="ad-box-label">Ad · TrueWeb Network</span>
                 <div className="ad-box-content">
                    <h4>Dominate with <b>HarvestAI</b></h4>
                    <p>Unlock business intelligence today.</p>
                    <a href="https://harvestai.com.ng" target="_blank" rel="noopener">Learn more →</a>
                 </div>
               </div>
             )}
          </div>
        </div>
      </section>

    </div>
  );
}
