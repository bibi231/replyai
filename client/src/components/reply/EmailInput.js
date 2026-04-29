import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function EmailInput({ value, onChange, disabled }) {
    const maxLength = 3000;
    const currentLength = value.length;
    let counterColor = 'text-[var(--text-secondary)]';
    if (currentLength >= 2900)
        counterColor = 'text-[var(--error)]';
    else if (currentLength >= 2500)
        counterColor = 'text-[var(--warning)]';
    return (_jsxs("div", { className: "flex flex-col h-full w-full relative", children: [_jsx("label", { className: "text-sm font-medium text-white mb-2 block", children: "Paste the email you received" }), _jsxs("div", { className: "relative flex-grow", children: [_jsx("textarea", { value: value, onChange: (e) => onChange(e.target.value), disabled: disabled, maxLength: maxLength, placeholder: "Hi there, I'm reaching out to see if you would be available for a meeting next Tuesday at 10 AM to discuss the quarterly report. Best, Segun", className: "w-full h-full min-h-[300px] bg-[var(--bg-surface)] border border-[var(--border)] focus:border-[var(--accent)] rounded-[var(--radius)] p-5 text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none resize-none transition-colors" }), _jsxs("div", { className: `absolute bottom-4 right-5 text-xs font-medium ${counterColor}`, children: [currentLength, " / ", maxLength] })] })] }));
}
