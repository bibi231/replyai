import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { useDocTitle } from '../hooks/useDocTitle';

const SECTIONS = [
  {
    title: 'Getting Started',
    items: [
      { q: 'What is ReplyAI?', a: 'ReplyAI is an AI-powered communication assistant that helps you write email replies and process meeting notes. Paste an email to get 3 reply drafts, or paste meeting notes to get summaries and action items. Built by TrueWeb Solutions for professionals across Africa and globally.' },
      { q: 'How do I create an account?', a: 'Click "Try it free" on the homepage or visit the Generator page. You can sign up with your Google account or email address. No credit card is required — you get 5 free credits immediately.' },
      { q: 'Is ReplyAI free?', a: 'Yes! Every account gets 5 free credits that reset on the 1st of every month. Each credit lets you generate 3 email reply drafts OR 1 meeting summary OR 1 action-item extraction. You can buy more credits when you need them, and paid credits never expire.' },
      { q: 'What languages are supported?', a: 'ReplyAI generates replies in English, Nigerian Pidgin, Yoruba, Hausa, and French. The meeting notes feature currently processes notes in English but can handle notes written in any of these languages.' },
    ],
  },
  {
    title: 'Email Reply Generator',
    items: [
      { q: 'How does the reply generator work?', a: 'Paste the email you want to reply to, select your preferred tone (professional, friendly, firm, apologetic, or custom), and click Generate. ReplyAI\'s AI will create 3 different reply drafts that vary in length and approach so you can pick the best fit.' },
      { q: 'What tone options are available?', a: 'Five tones: Professional (formal, business-appropriate), Friendly (warm, conversational), Firm (direct, assertive), Apologetic (empathetic, takes responsibility), and Custom (you describe the exact tone you want).' },
      { q: 'Can I save replies as templates?', a: 'Yes! After generating drafts, click "Save as Template" on any draft to add it to your template library. You can then reuse, copy, or edit templates anytime from the Dashboard.' },
      { q: 'Does it detect Nigerian context?', a: 'Yes. ReplyAI automatically detects Nigerian references (institutions, currency, cultural context) and adjusts the reply style accordingly for more authentic, relevant responses.' },
    ],
  },
  {
    title: 'Meeting Notes',
    items: [
      { q: 'How do meeting summaries work?', a: 'Create a meeting, paste your raw notes or transcript, then click "Summarize." The AI will produce a concise 3-5 bullet summary covering key decisions, discussion points, and outcomes. This costs 1 credit.' },
      { q: 'What are action items?', a: 'Action items are specific tasks extracted from your meeting notes. The AI identifies each task, assigns it to the person mentioned (or marks it "Unassigned"), sets a priority level (low/medium/high), and suggests a due date when possible. Extraction costs 1 credit.' },
      { q: 'Can I track action item completion?', a: 'Yes. Each action item has a status: pending, in progress, or done. Click any item to cycle through statuses. The meetings page shows completion progress across all your meetings.' },
      { q: 'What kind of notes work best?', a: 'Any format works — bullet points, paragraphs, transcripts, or even rough shorthand. The more detail you include about who said what and what was decided, the better the AI output will be. Notes should be at least 20 characters long.' },
    ],
  },
  {
    title: 'Credits & Billing',
    items: [
      { q: 'How do credits work?', a: 'Credits are the currency for AI actions. 1 credit = 1 email reply generation (3 drafts) OR 1 meeting summary OR 1 action-item extraction. Free credits reset monthly; paid credits never expire.' },
      { q: 'What payment methods are accepted?', a: 'Nigerian Naira (NGN) payments go through GTSquad and support Visa, Mastercard, USSD, and bank transfer. USD payments are also available through GTSquad for international cards.' },
      { q: 'Do paid credits expire?', a: 'No. Paid credits never expire. Only the 5 free monthly credits reset on the 1st of each month.' },
      { q: 'Can I get a refund?', a: 'We offer refunds for unused credits within 30 days of purchase. See our Refund Policy for full details.' },
    ],
  },
  {
    title: 'Privacy & Security',
    items: [
      { q: 'Is my email content stored?', a: 'Email content submitted to the reply generator is processed by our AI and not stored after generation. We keep a short snippet for your history page, but the full email text is not retained.' },
      { q: 'Are my meeting notes stored?', a: 'Yes, meeting notes are stored so you can access your meetings, summaries, and action items later. You can delete any meeting at any time, which permanently removes all associated data.' },
      { q: 'Who can see my data?', a: 'Only you. Your data is tied to your account and is not shared with other users, advertisers, or third parties. Our AI providers process your content for generation only.' },
    ],
  },
];

export function FAQ() {
  const [openIdx, setOpenIdx] = useState<string | null>(null);
  useDocTitle('Help Center & FAQ', 'Frequently asked questions about ReplyAI — email replies, meeting notes, credits, billing, and more.');

  return (
    <div className="home">
      <Navbar />
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '120px 24px 80px' }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 36, marginBottom: 8 }}>Help Center</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 48 }}>Everything you need to know about using ReplyAI.</p>

        {SECTIONS.map(section => (
          <div key={section.title} style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 22, marginBottom: 16, color: 'var(--accent)' }}>{section.title}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {section.items.map(item => {
                const key = `${section.title}-${item.q}`;
                const isOpen = openIdx === key;
                return (
                  <div key={key} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 12, overflow: 'hidden' }}>
                    <button
                      onClick={() => setOpenIdx(isOpen ? null : key)}
                      style={{ width: '100%', padding: '16px 20px', background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: 15, fontWeight: 600, textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      {item.q}
                      <span style={{ fontSize: 18, color: 'var(--text-muted)', transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
                    </button>
                    {isOpen && (
                      <div style={{ padding: '0 20px 16px', color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div style={{ marginTop: 48, padding: 32, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 16, textAlign: 'center' }}>
          <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Still have questions?</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 16, fontSize: 14 }}>Reach out to us at <a href="mailto:support@replyai.com.ng" style={{ color: 'var(--accent)' }}>support@replyai.com.ng</a></p>
          <Link to="/app" className="hero-cta-primary" style={{ display: 'inline-flex' }}>Try ReplyAI free</Link>
        </div>
      </main>
    </div>
  );
}
