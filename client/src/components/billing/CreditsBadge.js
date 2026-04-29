import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuthStore } from '../../store/authStore';
export function CreditsBadge() {
    const credits = useAuthStore((s) => s.credits);
    const openPricing = useAuthStore((s) => s.openPricing);
    if (!credits)
        return null;
    const { free, paid } = credits;
    if (free > 0) {
        return (_jsxs("button", { onClick: openPricing, className: "inline-flex items-center px-3 py-1 bg-[var(--badge-free)]/10 text-green-400 border border-[var(--badge-free)]/20 rounded-full text-sm font-medium hover:bg-[var(--badge-free)]/20 transition-colors", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-green-400 mr-2" }), free, " free ", free === 1 ? 'reply' : 'replies', " left"] }));
    }
    if (paid > 0) {
        return (_jsxs("button", { onClick: openPricing, className: "inline-flex items-center px-3 py-1 bg-[var(--badge-paid)]/10 text-purple-400 border border-[var(--badge-paid)]/20 rounded-full text-sm font-medium hover:bg-[var(--badge-paid)]/20 transition-colors", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-purple-400 mr-2" }), paid, " ", paid === 1 ? 'credit' : 'credits'] }));
    }
    return (_jsxs("button", { onClick: openPricing, className: "inline-flex items-center px-3 py-1 bg-[var(--error)]/10 text-red-400 border border-[var(--error)]/20 rounded-full text-sm font-medium hover:bg-[var(--error)]/20 transition-colors", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse" }), "No credits"] }));
}
