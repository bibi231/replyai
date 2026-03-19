import React, { useEffect } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose?: () => void;
    children: React.ReactNode;
    maxWidth?: string;
}

export function Modal({ isOpen, onClose, children, maxWidth = 'max-w-md' }: ModalProps) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && onClose) onClose();
        };
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEsc);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className={`relative bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl w-full ${maxWidth} p-6 shadow-2xl scale-100 animate-in fade-in zoom-in-95 duration-200 z-10 max-h-[90vh] overflow-y-auto`}>
                {children}
            </div>
        </div>
    );
}
