import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { useAuthStore } from '../store/authStore';
import { useDocTitle } from '../hooks/useDocTitle';

export function FeatureMeetings() {
  const user = useAuthStore(s => s.user);
  useDocTitle('AI Meeting Notes', 'Turn messy meeting notes into clear summaries and action items with AI.');

  return (
    <div className="home">
      <Navbar />

      <section className="hero" style={{ minHeight: '70vh' }}>
        <div className="hero-bg" aria-hidden>
          <div className="hero-glow" />
          <div className="hero-grid" />
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            New Feature · AI Meeting Notes
          </div>

          <h1 className="hero-headline">
            Turn messy meeting notes<br />into{' '}
            <span style={{ background: 'linear-gradient(135deg, #6366f1, #00d4aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>clear action items</span>.
          </h1>

          <p className="hero-sub">
            Paste your meeting notes, let AI summarize the key decisions and extract
            every action item with assignees, priorities, and due dates. Track progress
            right inside ReplyAI. Built for busy professionals who sit in too many meetings.
          </p>

          <div className="hero-actions">
            <Link to={user ? '/meetings' : '/app'} className="hero-cta-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              {user ? 'Go to Meetings' : 'Try it free'}
            </Link>
            <Link to="/pricing" className="hero-cta-secondary">See pricing</Link>
          </div>

          <div className="hero-stats">
            {[
              { value: '1', label: 'Credit per action' },
              { value: '3-5', label: 'Bullet summary' },
              { value: '100%', label: 'Actionable output' },
            ].map(s => (
              <div key={s.label} className="hero-stat">
                <span className="hero-stat-value">{s.value}</span>
                <span className="hero-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px' }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, textAlign: 'center', marginBottom: 48 }}>How it works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 32 }}>
          {[
            { step: '1', title: 'Paste your notes', desc: 'Copy-paste raw meeting notes, transcripts, or bullet points from any meeting tool.' },
            { step: '2', title: 'AI summarizes', desc: 'Get a concise 3-5 bullet summary capturing key decisions, discussion points, and outcomes.' },
            { step: '3', title: 'Extract action items', desc: 'AI identifies every action item with assignee, priority level, and suggested due date.' },
            { step: '4', title: 'Track & complete', desc: 'Check off items as you complete them. See progress across all your meetings.' },
          ].map(item => (
            <div key={item.step} style={{ background: 'var(--bg-surface, #141420)', border: '1px solid var(--border-subtle, #2a2a3e)', borderRadius: 16, padding: 28 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #00d4aa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: '#fff', marginBottom: 16 }}>{item.step}</div>
              <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{item.title}</h3>
              <p style={{ color: 'var(--text-secondary, #8e8ea0)', fontSize: 14, lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use cases */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, textAlign: 'center', marginBottom: 16 }}>Perfect for</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>Whether you're in back-to-back Zoom calls or weekly standups, ReplyAI keeps everyone accountable.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {[
            { title: 'Team standups', desc: 'Capture who committed to what and follow up without rewatching recordings.' },
            { title: 'Client meetings', desc: 'Send polished summaries to clients within minutes of hanging up.' },
            { title: 'Project kickoffs', desc: 'Break down big discussions into assignable, trackable tasks instantly.' },
            { title: 'One-on-ones', desc: 'Never forget feedback or commitments from your 1:1s again.' },
            { title: 'Board meetings', desc: 'Distill lengthy board discussions into clear decisions and next steps.' },
            { title: 'Brainstorm sessions', desc: 'Turn free-flowing ideas into structured action plans automatically.' },
          ].map(item => (
            <div key={item.title} style={{ padding: '20px 24px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 12 }}>
              <h4 style={{ fontWeight: 700, marginBottom: 6 }}>{item.title}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '60px 24px 100px' }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, marginBottom: 16 }}>Stop losing action items</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>Start with 5 free credits. No credit card required.</p>
        <Link to={user ? '/meetings' : '/app'} className="hero-cta-primary" style={{ display: 'inline-flex' }}>
          Get started free
        </Link>
      </section>
    </div>
  );
}
