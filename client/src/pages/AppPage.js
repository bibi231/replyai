import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { useReply } from '../hooks/useReply';
import { useCredits } from '../hooks/useCredits';
import { Navbar } from '../components/layout/Navbar';
import { ReplyCardSkeleton } from '../components/ui/Skeleton';
import { ReplyAIAd } from '../components/ads/ReplyAIAd';
import { api } from '../lib/api';
import { OUTPUT_LANGUAGES } from '../types/index';
const TONES = [
    { value: 'professional', label: 'Professional', icon: '💼' },
    { value: 'friendly', label: 'Friendly', icon: '😊' },
    { value: 'firm', label: 'Firm', icon: '⚡' },
    { value: 'apologetic', label: 'Apologetic', icon: '🤝' },
    { value: 'custom', label: 'Custom', icon: '✏️' },
];
const LANGS = Object.entries(OUTPUT_LANGUAGES).map(([key, val]) => ({
    value: key,
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
    const [emailContent, setEmailContent] = useState('');
    const [tone, setTone] = useState('professional');
    const [language, setLanguage] = useState('en');
    const [customInstruction, setCustomInstruction] = useState('');
    const [context, setContext] = useState('');
    const [showContext, setShowContext] = useState(false);
    const [generatingStep, setGeneratingStep] = useState(0);
    const [copiedId, setCopiedId] = useState(null);
    const [savedIds, setSavedIds] = useState(new Set());
    const stepIntervalRef = useRef(undefined);
    const outputRef = useRef(null);
    // Cycle through generating step text
    useEffect(() => {
        if (isGenerating) {
            setGeneratingStep(0);
            stepIntervalRef.current = window.setInterval(() => {
                setGeneratingStep(s => Math.min(s + 1, GENERATING_STEPS.length - 1));
            }, 900);
        }
        else {
            clearInterval(stepIntervalRef.current);
            if (replies.length > 0) {
                setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
            }
        }
        return () => clearInterval(stepIntervalRef.current);
    }, [isGenerating, replies.length]);
    async function handleGenerate() {
        if (!emailContent.trim() || isGenerating)
            return;
        clearReplies();
        // useReply.generate takes (emailContent, tone, context?, language?)
        const ctx = tone === 'custom' ? customInstruction : (context || undefined);
        await generate(emailContent, tone, ctx, language);
        refreshCredits();
    }
    async function handleSaveTemplate(draft) {
        try {
            await api.post('/api/templates', {
                title: draft.label,
                body: draft.body,
                tone: tone,
                category: 'reply'
            });
            setSavedIds(prev => new Set([...prev, draft.id]));
        }
        catch (err) {
            console.error('Failed to save template');
        }
    }
    function handleCopy(id, body) {
        navigator.clipboard.writeText(body);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    }
    const charCount = emailContent.length;
    const charLimit = 3000;
    const charPct = charCount / charLimit;
    return (_jsxs("div", { className: "app-layout", children: [_jsx(Navbar, {}), _jsxs("main", { className: "app-main", children: [_jsxs("div", { className: "app-input-panel", children: [_jsxs("div", { className: "input-panel-header", children: [_jsx("h2", { className: "input-panel-title", children: "Paste the email you received" }), _jsxs("div", { className: `char-counter ${charPct > 0.9 ? 'danger' : charPct > 0.75 ? 'warning' : ''}`, children: [charCount, "/", charLimit] })] }), _jsx("textarea", { className: "email-textarea", value: emailContent, onChange: e => setEmailContent(e.target.value.slice(0, charLimit)), placeholder: "Paste any email here \u2014 job application, client follow-up, invoice chase, lecturer reply...", rows: 10 }), !emailContent && (_jsx("button", { className: "sample-email-btn", onClick: () => setEmailContent(SAMPLE_EMAIL), children: "Try a sample email \u2192" })), _jsxs("div", { className: "tone-section", children: [_jsx("div", { className: "tone-section-label", children: "Reply Language" }), _jsx("div", { className: "tone-pills", children: LANGS.map(l => (_jsxs("button", { className: `tone-pill-btn ${language === l.value ? 'active' : ''}`, onClick: () => setLanguage(l.value), children: [_jsx("span", { className: "tone-pill-icon", children: l.icon }), l.label] }, l.value))) })] }), _jsxs("div", { className: "tone-section", children: [_jsx("div", { className: "tone-section-label", children: "Tone" }), _jsx("div", { className: "tone-pills", children: TONES.map(t => (_jsxs("button", { className: `tone-pill-btn ${tone === t.value ? 'active' : ''}`, onClick: () => setTone(t.value), children: [_jsx("span", { className: "tone-pill-icon", children: t.icon }), t.label] }, t.value))) }), tone === 'custom' && (_jsx("input", { className: "custom-tone-field", type: "text", value: customInstruction, onChange: e => setCustomInstruction(e.target.value.slice(0, 200)), placeholder: "e.g. enthusiastic but professional, like a Lagos startup founder", maxLength: 200 }))] }), _jsx("div", { className: "context-toggle-row", children: _jsx("button", { className: "context-toggle-btn", onClick: () => setShowContext(v => !v), children: showContext ? '− Hide context' : '+ Add context (optional)' }) }), showContext && (_jsx("textarea", { className: "context-field", value: context, onChange: e => setContext(e.target.value.slice(0, 300)), placeholder: "e.g. I'm a freelancer chasing an overdue payment. I want to be firm but not burn the bridge.", rows: 2 })), _jsx("button", { className: `generate-btn ${isGenerating ? 'generating' : ''}`, onClick: handleGenerate, disabled: !emailContent.trim() || isGenerating, children: isGenerating ? (_jsxs("span", { className: "generating-inner", children: [_jsx("span", { className: "generating-dot" }), _jsx("span", { className: "generating-dot", style: { animationDelay: '0.15s' } }), _jsx("span", { className: "generating-dot", style: { animationDelay: '0.3s' } }), _jsx("span", { className: "generating-step-text", children: GENERATING_STEPS[generatingStep] })] })) : (_jsxs(_Fragment, { children: ["Generate 3 replies", credits && (_jsx("span", { className: "generate-btn-sub", children: credits.free > 0
                                                ? `${credits.free} free ${credits.free === 1 ? 'reply' : 'replies'} left`
                                                : credits.paid > 0
                                                    ? `${credits.paid} credits`
                                                    : '0 credits — upgrade' }))] })) }), _jsx(ReplyAIAd, {}), error?.includes('INSUFFICIENT') && (_jsxs("div", { className: "credits-error-card", children: [_jsx("p", { children: "You've used all your free replies for this month." }), _jsx("a", { href: "/pricing", className: "credits-error-link", children: "Get more credits \u2192" })] }))] }), _jsxs("div", { className: "app-output-panel", ref: outputRef, children: [isGenerating && (_jsxs("div", { className: "output-generating", children: [_jsx("div", { className: "output-generating-label", children: GENERATING_STEPS[generatingStep] }), [0, 1, 2].map(i => (_jsx(ReplyCardSkeleton, {}, i)))] })), !isGenerating && replies.length === 0 && !error && (_jsxs("div", { className: "empty-state", children: [_jsx("div", { className: "empty-state-icon", children: _jsxs("svg", { width: "48", height: "48", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", opacity: "0.3", children: [_jsx("path", { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" }), _jsx("polyline", { points: "22,6 12,13 2,6" })] }) }), _jsx("h3", { className: "empty-state-title", children: "Your 3 drafts will appear here" }), _jsx("p", { className: "empty-state-sub", children: "Paste an email on the left, pick a tone, and hit generate. Takes about 3 seconds." })] })), !isGenerating && replies.length > 0 && (_jsxs("div", { className: "replies-list", children: [_jsxs("div", { className: "replies-header", children: [_jsx("span", { className: "replies-count", children: "3 drafts generated" }), _jsx("button", { className: "replies-regenerate", onClick: handleGenerate, children: "Regenerate" })] }), replies.map((draft, i) => (_jsxs("div", { className: "reply-card", style: { animationDelay: `${i * 80}ms` }, children: [_jsxs("div", { className: "reply-card-header", children: [_jsxs("div", { className: "reply-card-meta", children: [_jsx("span", { className: "reply-label", children: draft.label }), _jsxs("span", { className: "word-count-badge", children: [draft.wordCount, "w"] })] }), _jsxs("div", { className: "reply-card-actions", children: [_jsx("button", { className: `save-template-btn ${savedIds.has(draft.id) ? 'saved' : ''}`, onClick: () => handleSaveTemplate(draft), disabled: savedIds.has(draft.id), children: savedIds.has(draft.id) ? 'Saved' : 'Save as Template' }), _jsx("button", { className: `copy-btn ${copiedId === draft.id ? 'copied' : ''}`, onClick: () => handleCopy(draft.id, draft.body), children: copiedId === draft.id ? '✓ Copied' : 'Copy' })] })] }), _jsx("div", { className: "reply-subject", children: _jsx("span", { className: "subject-chip", children: draft.subject }) }), _jsx("div", { className: "reply-body", children: draft.body })] }, draft.id)))] }))] })] })] }));
}
