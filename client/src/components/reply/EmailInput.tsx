import React from 'react';

interface EmailInputProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export function EmailInput({ value, onChange, disabled }: EmailInputProps) {
    const maxLength = 3000;
    const currentLength = value.length;

    let counterColor = 'text-[var(--text-secondary)]';
    if (currentLength >= 2900) counterColor = 'text-[var(--error)]';
    else if (currentLength >= 2500) counterColor = 'text-[var(--warning)]';

    return (
        <div className="flex flex-col h-full w-full relative">
            <label className="text-sm font-medium text-white mb-2 block">Paste the email you received</label>
            <div className="relative flex-grow">
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    maxLength={maxLength}
                    placeholder="Hi there, I'm reaching out to see if you would be available for a meeting next Tuesday at 10 AM to discuss the quarterly report. Best, Segun"
                    className="w-full h-full min-h-[300px] bg-[var(--bg-surface)] border border-[var(--border)] focus:border-[var(--accent)] rounded-[var(--radius)] p-5 text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none resize-none transition-colors"
                />
                <div className={`absolute bottom-4 right-5 text-xs font-medium ${counterColor}`}>
                    {currentLength} / {maxLength}
                </div>
            </div>
        </div>
    );
}
