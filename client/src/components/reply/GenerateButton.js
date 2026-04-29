import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
export function GenerateButton({ onClick, disabled, isLoading }) {
    const credits = useAuthStore(s => s.credits);
    const hasCredits = credits ? credits.canGenerate : false;
    return (_jsxs("div", { className: "w-full mt-6", children: [_jsx(Button, { size: "lg", className: "w-full font-bold text-base shadow-lg shadow-[var(--accent)]/10 py-4", onClick: onClick, disabled: disabled || !hasCredits, isLoading: isLoading, children: isLoading ? 'Generating...' : 'Generate 3 replies →' }), hasCredits && (_jsx("p", { className: "text-center text-xs text-[var(--text-secondary)] mt-3", children: "Uses 1 credit" })), !hasCredits && credits && (_jsx("p", { className: "text-center text-xs text-[var(--error)] mt-3", children: "You need credits to generate" }))] }));
}
