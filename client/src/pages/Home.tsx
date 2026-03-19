import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <nav className="h-16 flex items-center px-6 justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[var(--accent)] to-[#a8a4ff] flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(108,99,255,0.4)]">
            R
          </div>
          <span className="font-display font-bold text-xl tracking-tight">Reply<span className="text-[var(--accent)]">AI</span></span>
        </div>
        <Link to="/app" className="text-sm font-medium hover:text-white transition-colors py-2 px-5 rounded-full bg-white text-black hover:bg-gray-200">
          Sign in
        </Link>
      </nav>

      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 pb-20 pt-10 text-center">
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display font-bold tracking-tight mb-6 max-w-4xl mx-auto drop-shadow-xl text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
          Stop stressing over email replies.
        </h1>
        <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          Paste any email. Pick a tone. Get 3 professional drafts in seconds. Powered by AI, built for Nigerian professionals.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <Link to="/app">
            <Button size="lg" className="w-full sm:w-auto font-bold px-8 shadow-[0_0_20px_rgba(108,99,255,0.3)] hover:shadow-[0_0_30px_rgba(108,99,255,0.5)]">
              Try it free →
            </Button>
          </Link>
          <Link to="/pricing">
            <Button variant="ghost" size="lg" className="w-full sm:w-auto px-8">
              See pricing
            </Button>
          </Link>
        </div>
        
        <p className="text-sm text-[var(--text-muted)] font-medium mb-16">
          No credit card needed — 5 free replies every month
        </p>

        <div className="relative w-full max-w-6xl mx-auto rounded-3xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 backdrop-blur-sm overflow-hidden aspect-[16/9] flex items-center justify-center shadow-2xl before:absolute before:inset-0 before:bg-gradient-to-b before:from-[var(--accent)]/5 before:to-transparent">
          <p className="text-[var(--text-muted)] text-xl font-display drop-shadow">App preview</p>
        </div>
      </main>

      <footer className="mt-auto py-8 border-t border-[var(--border)] text-center text-sm text-[var(--text-secondary)] flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 px-6">
        <span>Made in Abuja 🇳🇬</span>
        <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
        <span className="cursor-pointer hover:text-white transition-colors">Privacy</span>
        <span className="cursor-pointer hover:text-white transition-colors">Terms</span>
      </footer>
    </div>
  );
}
