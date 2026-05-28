import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { useDocTitle } from '../hooks/useDocTitle';

export function About() {
  useDocTitle('About', 'Learn about ReplyAI — the AI communication assistant built by TrueWeb Solutions.');

  return (
    <div className="home">
      <Navbar />
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '120px 24px 80px' }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 36, marginBottom: 16 }}>About ReplyAI</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
          ReplyAI is an AI-powered communication assistant built by TrueWeb Solutions for professionals who spend too much time writing emails and tracking meeting outcomes. We believe your time is better spent doing meaningful work — not staring at a blank reply box or hunting through meeting notes for who promised what.
        </p>

        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 24, marginBottom: 12, marginTop: 40 }}>Our Mission</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
          We're on a mission to make professional communication faster and smarter for everyone — from solo freelancers in Lagos to distributed teams across Africa and beyond. ReplyAI supports English, Nigerian Pidgin, Yoruba, Hausa, and French because effective communication should work in the language you think in.
        </p>

        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 24, marginBottom: 12, marginTop: 40 }}>What We Offer</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.7, marginBottom: 12 }}>
          ReplyAI combines two powerful tools under one roof:
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.7, marginBottom: 12 }}>
          <strong style={{ color: 'var(--text-primary)' }}>AI Email Reply Generator</strong> — Paste any email, choose your tone (professional, friendly, firm, apologetic, or custom), and get 3 complete reply drafts in seconds. Each draft varies in length and approach so you always have options.
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
          <strong style={{ color: 'var(--text-primary)' }}>AI Meeting Notes</strong> — Paste raw meeting notes or transcripts and get a concise summary plus structured action items with assignees, priorities, and due dates. Track completion right inside the app.
        </p>

        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 24, marginBottom: 12, marginTop: 40 }}>How We Handle Your Data</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
          Your email content and meeting notes are sent to our AI models solely for generating replies and summaries. We don't store your email content after generation. Meeting notes are stored so you can access them later, and you can delete them at any time. We never sell your data or use it for advertising. Read our full <Link to="/privacy" style={{ color: 'var(--accent)' }}>Privacy Policy</Link> for details.
        </p>

        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 24, marginBottom: 12, marginTop: 40 }}>Built in Nigeria, for the World</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
          ReplyAI is built by TrueWeb Solutions, a Nigerian software studio. We accept both Naira (via GTSquad) and USD payments. Our pricing is designed to be accessible — everyone gets 5 free credits every month, and paid credits never expire.
        </p>

        <div style={{ marginTop: 48, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link to="/app" className="hero-cta-primary" style={{ display: 'inline-flex' }}>Try ReplyAI free</Link>
          <Link to="/pricing" className="hero-cta-secondary" style={{ display: 'inline-flex' }}>View pricing</Link>
        </div>
      </main>
    </div>
  );
}
