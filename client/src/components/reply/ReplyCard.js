import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
export function ReplyCard({ draft, index }) {
    const [copyStatus, setCopyStatus] = useState('idle');
    const handleCopy = async (type) => {
        let textToCopy = draft.body;
        if (type === 'all') {
            textToCopy = `${draft.subject}\n\n${draft.body}`;
        }
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopyStatus(type);
            setTimeout(() => setCopyStatus('idle'), 2000);
        }
        catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };
    return (_jsx("div", { className: "animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both", style: { animationDelay: `${index * 120}ms` }, children: _jsxs(Card, { className: "hover:border-[var(--border-hover)] transition-colors h-full flex flex-col", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx(Badge, { variant: "paid", children: draft.label }), _jsxs("span", { className: "text-xs text-[var(--text-secondary)]", children: [draft.wordCount, " words"] })] }), _jsx("div", { className: "bg-[var(--bg-surface)] px-3 py-2 rounded-md mb-4 border border-[var(--border)] overflow-x-hidden", children: _jsx("span", { className: "text-xs font-mono text-[var(--text-secondary)] whitespace-nowrap text-ellipsis overflow-hidden block", children: draft.subject }) }), _jsx("div", { className: "text-sm leading-relaxed text-[var(--text-primary)] mb-6 whitespace-pre-wrap flex-grow", children: draft.body }), _jsxs("div", { className: "flex gap-2 mt-auto pt-4 border-t border-[var(--border)]", children: [_jsx("button", { onClick: () => handleCopy('body'), className: `flex-1 py-2 rounded-[var(--radius)] text-xs font-medium transition-colors flex items-center justify-center gap-2 ${copyStatus === 'body'
                                ? 'bg-[var(--success)]/20 text-green-400 border border-[var(--success)]/30'
                                : 'bg-[var(--bg-surface)] text-white hover:bg-[var(--bg-elevated)] border border-[var(--border)]'}`, children: copyStatus === 'body' ? 'Copied ✓' : 'Copy reply' }), _jsx("button", { onClick: () => handleCopy('all'), className: `flex-1 py-2 rounded-[var(--radius)] text-xs font-medium transition-colors flex items-center justify-center gap-2 ${copyStatus === 'all'
                                ? 'bg-[var(--success)]/20 text-green-400 border border-[var(--success)]/30'
                                : 'bg-transparent text-[var(--text-secondary)] hover:text-white border border-transparent'}`, children: copyStatus === 'all' ? 'Copied ✓' : 'Copy with subject' })] })] }) }));
}
