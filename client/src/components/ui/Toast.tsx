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
            }, 3500);
            return () => clearTimeout(timer);
        }
    }, [toasts]);

    return (
        <div className="toast-stack" role="region" aria-label="Notifications">
            {toasts.map((t) => (
                <div key={t.id} className={`toast toast-${t.type}`}>
                    <span className="toast-icon">
                        {t.type === 'success' && '✓'}
                        {t.type === 'error' && '✕'}
                        {t.type === 'info' && 'i'}
                    </span>
                    <span className="toast-msg">{t.message}</span>
                </div>
            ))}
        </div>
    );
}
