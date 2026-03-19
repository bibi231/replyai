import React, { useState, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastOptions {
    id: string;
    message: string;
    type: ToastType;
}

let toastListener: ((t: ToastOptions) => void) | null = null;
let toastIdCounter = 0;

export const toast = (message: string, type: ToastType = 'info') => {
    if (toastListener) {
        toastListener({ id: String(++toastIdCounter), message, type });
    }
};

export function ToastContainer() {
    const [toasts, setToasts] = useState<ToastOptions[]>([]);

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
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toasts]);

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
            {toasts.map((t) => (
                <div key={t.id} className={`pointer-events-auto bg-[var(--bg-elevated)] border border-[var(--border)] px-4 py-3 rounded-[var(--radius)] shadow-lg flex items-center gap-3 animate-in slide-in-from-right-full ${t.type === 'success' ? 'border-l-4 border-l-[var(--success)]' :
                        t.type === 'error' ? 'border-l-4 border-l-[var(--error)]' :
                            'border-l-4 border-l-[var(--accent)]'
                    }`}>
                    <span className="text-sm font-medium">{t.message}</span>
                </div>
            ))}
        </div>
    );
}
