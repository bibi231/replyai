import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    maxLength?: number;
}

export function Textarea({ className = '', maxLength, value, ...props }: TextareaProps) {
    const currentLength = value ? String(value).length : 0;

    return (
        <div className="relative w-full">
            <textarea
                value={value}
                maxLength={maxLength}
                className={`w-full bg-[var(--bg-surface)] border border-[var(--border)] focus:border-[var(--accent)] rounded-[var(--radius)] p-4 text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none resize-y transition-colors ${className}`}
                {...props}
            />
            {maxLength && (
                <div className={`absolute bottom-3 right-4 text-xs ${currentLength >= maxLength * 0.95 ? 'text-[var(--error)]' : currentLength >= maxLength * 0.8 ? 'text-[var(--warning)]' : 'text-[var(--text-secondary)]'}`}>
                    {currentLength} / {maxLength}
                </div>
            )}
        </div>
    );
}
