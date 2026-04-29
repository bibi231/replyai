import { jsx as _jsx } from "react/jsx-runtime";
export function Input({ className = '', ...props }) {
    return (_jsx("input", { className: `w-full bg-[var(--bg-surface)] border border-[var(--border)] focus:border-[var(--accent)] rounded-[var(--radius)] px-4 py-2 text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none transition-colors ${className}`, ...props }));
}
