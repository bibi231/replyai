import React from 'react';

export function Spinner({ size = 20, className = '' }: { size?: number; className?: string }) {
    return (
        <div
            className={`spinner-ring ${className}`}
            style={{ width: size, height: size }}
            aria-label="Loading"
        />
    );
}
