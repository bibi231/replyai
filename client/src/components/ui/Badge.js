import { jsx as _jsx } from "react/jsx-runtime";
export function Badge({ children, variant = 'neutral', className = '' }) {
    const base = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium";
    const variants = {
        free: "bg-[var(--badge-free)]/20 text-green-400 border border-[var(--badge-free)]/30",
        paid: "bg-[var(--badge-paid)]/20 text-purple-400 border border-[var(--badge-paid)]/30",
        neutral: "bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border)]"
    };
    return (_jsx("span", { className: `${base} ${variants[variant]} ${className}`, children: children }));
}
