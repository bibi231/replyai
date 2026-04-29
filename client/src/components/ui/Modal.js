import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
export function Modal({ isOpen, onClose, children, maxWidth = 'max-w-md' }) {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && onClose)
                onClose();
        };
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEsc);
        }
        else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);
    if (!isOpen)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity", onClick: onClose }), _jsx("div", { className: `relative bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl w-full ${maxWidth} p-6 shadow-2xl scale-100 animate-in fade-in zoom-in-95 duration-200 z-10 max-h-[90vh] overflow-y-auto`, children: children })] }));
}
