import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { useAuthStore } from '../store/authStore';
import { useDocTitle } from '../hooks/useDocTitle';

const FEATURES = [
  {
    title: 'AI Email Reply Generator',
    desc: 'Paste any email, choose your tone, and get 3 complete reply drafts instantly. Each draft varies in length and approach — pick the one that fits, edit if needed, and send.',
    highlights: ['5 tone options: professional, friendly, firm, apologetic, custom', '3 drafts per generation with different lengths', 'Supports English, Pidgin, Yoruba, Hausa & French', 'Save favorites as reusable templates'],
    link: '/app',
    cta: 'Try the Generator',
  },
  {
    title: 'AI Meeting Notes',
    desc: 'Turn raw meeting notes into structured summaries and actionable tasks. Paste notes from any source — Zoom transcripts, handwritten bullet points, or voice memo text.',
    highlights: ['Concise 3-5 bullet AI summaries', 'Auto-extracted action items with assignees & priorities', 'Track task completion across meetings', 'Tag and search your meeting history'],
    link: '/features/meetings',
    cta: 'Learn more',
  },
  {
    title: 'Reply Templates',
    desc: 'Save any AI-generated draft as a reusable template. Build a personal library of go-to responses for common email types — client follow-ups, invoice reminders, introductions.',
    highlights: ['One-click save from any draft', 'Organize by category and tone', 'Copy to clipboard instantly', 'Edit and customize anytime'],
    link: '/dashboard',
    cta: 'View your templates',
  },
  {
    title: 'Gmail Chrome Extension',
    desc: 'ReplyAI lives inside Gmail. Open any email, click the ReplyAI button, and get drafts without leaving your inbox. No copy-pasting required.',
    highlights: ['One-click from any Gmail thread', 'Auto-detects email content', 'Inserts draft directly into compose', 'Works alongside all Gmail features'],
    link: 'https://chrome.google.com/webstore',
    cta: 'Coming soon',
    external: true,
  },
];

export function Features() {
  const user = useAuthStore(s => s.user);
  useDocTitle('Features', 'AI email replies, meeting summaries, action items, templates — everything you need to communicate smarter.');

  return (
    <div className="home">
      <Navbar />

      <section className="hero" style={{ minHeight: '50vh' }}>
        <div className="hero-bg" aria-hidden>
          <div className="hero-glow" />
          <div className="hero-grid" />
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            All Features
          </div>
          <h1 className="hero-headline">Everything you need to<br />communicate smarter.</h1>
          <p className="hero-sub">From email replies to meeting action items — ReplyAI handles the busywork so you can focus on what matters.</p>
        </div>
      </section>

      <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
        {FEATURES.map((f, i) => (
          <div key={f.title} style={{ padding: '48px 0', borderBottom: i < FEATURES.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, marginBottom: 12 }}>{f.title}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.7, marginBottom: 20, maxWidth: 700 }}>{f.desc}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, marginBottom: 20 }}>
              {f.highlights.map(h => (
                <div key={h} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, color: 'var(--text-secondary)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 3 }}><polyline points="20 6 9 17 4 12" /></svg>
                  {h}
                </div>
              ))}
            </div>
            {f.external ? (
              <span style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 600 }}>{f.cta} ✦</span>
            ) : (
              <Link to={f.link} style={{ color: 'var(--accent)', fontSize: 14, fontWeight: 600 }}>{f.cta} →</Link>
            )}
          </div>
        ))}
      </section>

      <section style={{ textAlign: 'center', padding: '40px 24px 100px' }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, marginBottom: 16 }}>Ready to save hours every week?</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>5 free credits every month. No credit card needed.</p>
        <Link to={user ? '/app' : '/app'} className="hero-cta-primary" style={{ display: 'inline-flex' }}>Get started free</Link>
      </section>
    </div>
  );
}
