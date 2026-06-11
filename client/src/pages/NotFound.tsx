import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';

export default function NotFound() {
  return (
    <>
    <Navbar />
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px' }}>
      <div style={{ textAlign: 'center', maxWidth: 460 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 92, lineHeight: 1, color: 'var(--accent)' }}>404</div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 25, color: 'var(--text-primary)', marginTop: 16 }}>Page not found</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginTop: 10, lineHeight: 1.6 }}>
          That page doesn't exist or has moved. Try one of these instead.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 26, flexWrap: 'wrap' }}>
          <Link to="/" className="nav-cta">Back home</Link>
          <Link to="/app" className="navbar-link" style={{ border: '1px solid var(--border-default)', borderRadius: 8, padding: '8px 16px' }}>Try the generator</Link>
          <Link to="/pricing" className="navbar-link" style={{ border: '1px solid var(--border-default)', borderRadius: 8, padding: '8px 16px' }}>Pricing</Link>
        </div>
      </div>
    </main>
    </>
  );
}
