import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Input } from '../ui/Input';
const TONES = [
    { id: 'professional', label: 'Professional', icon: '💼' },
    { id: 'friendly', label: 'Friendly', icon: '👋' },
    { id: 'firm', label: 'Firm', icon: '🛑' },
    { id: 'apologetic', label: 'Apologetic', icon: '🙏' },
    { id: 'custom', label: 'Custom', icon: '✨' },
];
export function ToneSelector({ tone, setTone, customTone, setCustomTone, disabled }) {
    return (_jsxs("div", { className: "w-full mt-6", children: [_jsx("label", { className: "text-sm font-medium text-white mb-3 block", children: "Pick a tone" }), _jsx("div", { className: "flex flex-wrap gap-2 mb-3", children: TONES.map(t => (_jsxs("button", { type: "button", disabled: disabled, onClick: () => setTone(t.id), className: `px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${tone === t.id
                        ? 'bg-[var(--accent)] text-white border border-transparent shadow-lg shadow-[var(--accent)]/20'
                        : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-white border border-[var(--border)] hover:border-[var(--border-hover)]'}`, children: [_jsx("span", { children: t.icon }), " ", t.label] }, t.id))) }), _jsx("div", { className: `overflow-hidden transition-all duration-300 ease-in-out ${tone === 'custom' ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`, children: _jsx(Input, { disabled: disabled, value: customTone, onChange: (e) => setCustomTone(e.target.value), maxLength: 200, placeholder: "e.g. enthusiastic but respectful", className: "mt-2" }) })] }));
}
