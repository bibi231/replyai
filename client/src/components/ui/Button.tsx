import React from 'react';
import { Spinner } from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export function Button({ variant = 'primary', size = 'md', isLoading, children, className = '', ...props }: ButtonProps) {
    const base = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]",
        ghost: "bg-transparent border border-[var(--border)] hover:bg-[var(--bg-surface)] hover:text-white text-gray-300",
        danger: "bg-[var(--error)] text-white hover:bg-red-600"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm rounded-[var(--radius)]",
        md: "px-4 py-2 text-sm rounded-[var(--radius)]",
        lg: "px-6 py-3 text-base rounded-[var(--radius)]"
    };

    return (
        <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={isLoading || props.disabled} {...props}>
            {isLoading && <Spinner size="sm" className="mr-2" />}
            {children}
        </button>
    );
}
