import { jsx as _jsx } from "react/jsx-runtime";
export function Card({ children, className = '', ...props }) {
    return (_jsx("div", { className: `bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl p-6 ${className}`, ...props, children: children }));
}
