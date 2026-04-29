import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
let toastListener = null;
let toastIdCounter = 0;
export const toast = (message, type = 'info') => {
    if (toastListener) {
        toastListener({ id: String(++toastIdCounter), message, type });
    }
};
export function ToastContainer() {
    const [toasts, setToasts] = useState([]);
    useEffect(() => {
        toastListener = (t) => {
            setToasts((prev) => [...prev.slice(-2), t]);
        };
        return () => { toastListener = null; };
    }, []);
    useEffect(() => {
        if (toasts.length > 0) {
            const timer = setTimeout(() => {
                setToasts((prev) => prev.slice(1));
            }, 3500);
            return () => clearTimeout(timer);
        }
    }, [toasts]);
    return (_jsx("div", { className: "toast-stack", role: "region", "aria-label": "Notifications", children: toasts.map((t) => (_jsxs("div", { className: `toast toast-${t.type}`, children: [_jsxs("span", { className: "toast-icon", children: [t.type === 'success' && '✓', t.type === 'error' && '✕', t.type === 'info' && 'i'] }), _jsx("span", { className: "toast-msg", children: t.message })] }, t.id))) }));
}
