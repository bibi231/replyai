import React, { useState, useRef, useEffect } from 'react';
import { useReply } from '../hooks/useReply';
import { useCredits } from '../hooks/useCredits';
import { Navbar } from '../components/layout/Navbar';
import { ReplyCardSkeleton } from '../components/ui/Skeleton';
import { ReplyAIAd } from '../components/ads/ReplyAIAd';
import { api } from '../lib/api';
import type { ToneType, OutputLanguage } from '../types/index';
import { OUTPUT_LANGUAGES } from '../types/index';
import { useAuthStore } from '../store/authStore';

const TONES: { value: ToneType; label: string; icon: string }[] = [
    { value: 'professional', label: 'Professional', icon: '💼' },
    { value: 'friendly', label: 'Friendly', icon: '😊' },
    { value: 'firm', label: 'Firm', icon: '⚡' },
    { value: 'apologetic', label: 'Apologetic', icon: '🤝' },
    { value: 'custom', label: 'Custom', icon: '✏️' },
];

const LANGS = Object.entries(OUTPUT_LANGUAGES).map(([key, val]) => ({
    value: key as OutputLanguage,
    ...val
}));

const GENERATING_STEPS = [
    'Reading your email...',
    'Analysing tone and context...',
    'Writing draft 1...',
    'Writing draft 2...',
    'Writing draft 3...',
    'Polishing replies...',
];

const SAMPLE_EMAIL = `Hi,

I wanted to follow up on the proposal I sent last Tuesday for the brand identity project. We're quite interested in working with your team and would love to get your thoughts.

Could you let me know if you've had a chance to review it, and if there are any questions or adjustments you'd like to discuss?

Looking forward to hearing from you.

Best regards,
Amara`;

export function AppPage() {
    const { replies, isGenerating, error, generate, clearReplies } = useReply();
    const { credits, refreshCredits } = useCredits();
    const openPricing = useAuthStore((s: any) => s.openPricing);

    const [emailContent, setEmailContent] = useState('');
    const [tone, setTone] = useState<ToneType>('professional');
    const [language, setLanguage] = useState<OutputLanguage>('en');
    const [customInstruction, setCustomInstruction] = useState('');
    const [context, setContext] = useState('');
    const [showContext, setShowContext] = useState(false);
    const [showTips, setShowTips] = useState(true);
    const [generatingStep, setGeneratingStep] = useState(0);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
    const stepIntervalRef = useRef<number | undefined>(undefined);
    const outputRef = useRef<HTMLDivElement>(null);

    // Load settings defaults
    useEffect(() => {
        async function fetchSettings() {
            try {
                const res = await api.get('/api/user/settings');
                if (res.data.defaultTone) setTone(res.data.defaultTone);
                if (res.data.defaultLanguage) setLanguage(res.data.defaultLanguage);
                if (typeof res.data.showTips === 'boolean') setShowTips(res.data.showTips);
            } catch (err) {
                console.error("Failed to load settings", err);
            }
        }
        fetchSettings();
    }, []);

    // Cycle through generating step text
    useEffect(() => {
        if (isGenerating) {
            setGeneratingStep(0);
            stepIntervalRef.current = window.setInterval(() => {
                setGeneratingStep(s => Math.min(s + 1, GENERATING_STEPS.length - 1));
            }, 900);
        } else {
            clearInterval(stepIntervalRef.current);
            if (replies.length > 0) {
                setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
            }
        }
        return () => clearInterval(stepIntervalRef.current);
    }, [isGenerating, replies.length]);

    async function handleGenerate() {
        if (!emailContent.trim() || isGenerating) return;
        const totalCredits = (credits?.free ?? 0) + (credits?.paid ?? 0);
        if (totalCredits <= 0) { openPricing(); return; }
        clearReplies();
        const ctx = tone === 'custom' ? customInstruction : (context || undefined);
        await generate(emailContent, tone, ctx, language);
        refreshCredits();
    }

    async function handleSaveTemplate(draft: any) {
        try {
            await api.post('/api/templates', {
                title: draft.label,
                body: draft.body,
                tone: tone,
                category: 'reply'
            });
            setSavedIds(prev => new Set([...prev, draft.id]));
        } catch (err) {
            console.error('Failed to save template');
        }
    }

    function handleCopy(id: string, body: string) {
        navigator.clipboard.writeText(body);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    }

    const charCount = emailContent.length;
    const charLimit = 3000;
    const charPct = charCount / charLimit;

    return (
        <div className="app-layout">
            <Navbar />
            <main className="app-main">
                <div className="app-input-panel">
                    <div className="input-panel-header">
                        <h2 className="input-panel-title">Paste the email you received</h2>
                        <div className={`char-counter ${charPct > 0.9 ? 'danger' : charPct > 0.75 ? 'warning' : ''}`}>
                            {charCount}/{charLimit}
                        </div>
                    </div>

                    <textarea
                        className="email-textarea"
                        value={emailContent}
                        onChange={e => setEmailContent(e.target.value.slice(0, charLimit))}
                        placeholder="Paste any email here — job application, client follow-up, invoice chase, lecturer reply..."
                        rows={10}
                    />

                    {!emailContent && (
                        <button className="sample-email-btn" onClick={() => setEmailContent(SAMPLE_EMAIL)}>
                            Try a sample email →
                        </button>
                    )}

                    {showTips && !emailContent && (
                        <div className="generator-tip">
                            <strong>Tip:</strong> Pick a tone like "Firm" for debt recovery or "Friendly" for networking.
                        </div>
                    )}

                    <div className="tone-section">
                        <div className="tone-section-label">Reply Language</div>
                        <div className="tone-pills">
                            {LANGS.map(l => (
                                <button
                                    key={l.value}
                                    className={`tone-pill-btn ${language === l.value ? 'active' : ''}`}
                                    onClick={() => setLanguage(l.value)}
                                >
                                    <span className="tone-pill-icon">{l.icon}</span>
                                    {l.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="tone-section">
                        <div className="tone-section-label">Tone</div>
                        <div className="tone-pills">
                            {TONES.map(t => (
                                <button
                                    key={t.value}
                                    className={`tone-pill-btn ${tone === t.value ? 'active' : ''}`}
                                    onClick={() => setTone(t.value)}
                                >
                                    <span className="tone-pill-icon">{t.icon}</span>
                                    {t.label}
                                </button>
                            ))}
                        </div>
                        {tone === 'custom' && (
                            <input
                                className="custom-tone-field"
                                type="text"
                                value={customInstruction}
                                onChange={e => setCustomInstruction(e.target.value.slice(0, 200))}
                                placeholder="e.g. enthusiastic but professional, like a Lagos startup founder"
                                maxLength={200}
                            />
                        )}
                    </div>

                    <div className="context-toggle-row">
                        <button className="context-toggle-btn" onClick={() => setShowContext(v => !v)}>
                            {showContext ? '− Hide context' : '+ Add context (optional)'}
                        </button>
                    </div>
                    {showContext && (
                        <textarea
                            className="context-field"
                            value={context}
                            onChange={e => setContext(e.target.value.slice(0, 300))}
                            placeholder="e.g. I'm a freelancer chasing an overdue payment. I want to be firm but not burn the bridge."
                            rows={2}
                        />
                    )}

                    <button
                        className={`generate-btn ${isGenerating ? 'generating' : ''}`}
                        onClick={handleGenerate}
                        disabled={!emailContent.trim() || isGenerating}
                    >
                        {isGenerating ? (
                            <span className="generating-inner">
                                <span className="generating-dot" />
                                <span className="generating-dot" style={{ animationDelay: '0.15s' }} />
                                <span className="generating-dot" style={{ animationDelay: '0.3s' }} />
                                <span className="generating-step-text">{GENERATING_STEPS[generatingStep]}</span>
                            </span>
                        ) : (
                            <>
                                Generate 3 replies
                                {credits && (
                                    <span className="generate-btn-sub">
                                        {credits.free > 0
                                            ? `${credits.free} free ${credits.free === 1 ? 'reply' : 'replies'} left`
                                            : credits.paid > 0
                                                ? `${credits.paid} credits`
                                                : '0 credits — upgrade'}
                                    </span>
                                )}
                            </>
                        )}
                    </button>

                    <ReplyAIAd />

                    {error && (
                        <div className={`error-banner${error.includes('INSUFFICIENT') ? ' error-banner--credits' : ''}`}>
                            <span>{error}</span>
                            {error.includes('INSUFFICIENT') && (
                                <button onClick={openPricing} className="credits-error-link">Get more credits →</button>
                            )}
                        </div>
                    )}
                </div>

                <div className="app-output-panel" ref={outputRef}>
                    {isGenerating && (
                        <div className="output-generating">
                            <div className="output-generating-label">{GENERATING_STEPS[generatingStep]}</div>
                            {[0, 1, 2].map(i => (
                                <ReplyCardSkeleton key={i} />
                            ))}
                        </div>
                    )}

                    {!isGenerating && replies.length === 0 && !error && (
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                            </div>
                            <h3 className="empty-state-title">Your 3 drafts will appear here</h3>
                            <p className="empty-state-sub">Paste an email on the left, pick a tone, and hit generate. Takes about 3 seconds.</p>
                        </div>
                    )}

                    {!isGenerating && replies.length > 0 && (
                        <div className="replies-list">
                            <div className="replies-header">
                                <span className="replies-count">3 drafts generated</span>
                                <button className="replies-regenerate" onClick={handleGenerate}>Regenerate</button>
                            </div>
                            {replies.map((draft, i) => (
                                <div
                                    key={draft.id}
                                    className="reply-card"
                                    style={{ animationDelay: `${i * 80}ms` }}
                                >
                                    <div className="reply-card-header">
                                        <div className="reply-card-meta">
                                            <span className="reply-label">{draft.label}</span>
                                            <span className="word-count-badge">{draft.wordCount}w</span>
                                        </div>
                                        <div className="reply-card-actions">
                                            <button
                                                className={`save-template-btn ${savedIds.has(draft.id) ? 'saved' : ''}`}
                                                onClick={() => handleSaveTemplate(draft)}
                                                disabled={savedIds.has(draft.id)}
                                            >
                                                {savedIds.has(draft.id) ? 'Saved' : 'Save as Template'}
                                            </button>
                                            <button
                                                className={`copy-btn ${copiedId === draft.id ? 'copied' : ''}`}
                                                onClick={() => handleCopy(draft.id, draft.body)}
                                            >
                                                {copiedId === draft.id ? '✓ Copied' : 'Copy'}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="reply-subject">
                                        <span className="subject-chip">{draft.subject}</span>
                                    </div>
                                    <div className="reply-body">{draft.body}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
