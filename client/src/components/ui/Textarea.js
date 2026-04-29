import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Textarea({ className = '', maxLength, value, ...props }) {
    const currentLength = value ? String(value).length : 0;
    return (_jsxs("div", { className: "relative w-full", children: [_jsx("textarea", { value: value, maxLength: maxLength, className: `w-full bg-[var(--bg-surface)] border border-[var(--border)] focus:border-[var(--accent)] rounded-[var(--radius)] p-4 text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none resize-y transition-colors ${className}`, ...props }), maxLength && (_jsxs("div", { className: `absolute bottom-3 right-4 text-xs ${currentLength >= maxLength * 0.95 ? 'text-[var(--error)]' : currentLength >= maxLength * 0.8 ? 'text-[var(--warning)]' : 'text-[var(--text-secondary)]'}`, children: [currentLength, " / ", maxLength] }))] }));
}
