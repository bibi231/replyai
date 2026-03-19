import React from 'react';

export function Card({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl p-6 ${className}`} {...props}>
            {children}
        </div>
    );
}
