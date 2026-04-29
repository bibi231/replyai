import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type Size = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
    /** @deprecated Use `loading` instead */
    isLoading?: boolean;
    icon?: React.ReactNode;
    iconRight?: React.ReactNode;
    fullWidth?: boolean;
}

export function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    isLoading = false,
    icon,
    iconRight,
    fullWidth,
    children,
    disabled,
    className = '',
    style,
    ...props
}: ButtonProps) {
    const isSpinning = loading || isLoading;

    const base = `
    inline-flex items-center justify-center gap-2 font-medium transition-all duration-150
    cursor-pointer select-none relative overflow-hidden
    disabled:opacity-40 disabled:cursor-not-allowed
  `;

    const variants: Record<Variant, string> = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        ghost: 'btn-ghost',
        danger: 'btn-danger',
        success: 'btn-success',
    };

    const sizes: Record<Size, string> = {
        xs: 'btn-xs',
        sm: 'btn-sm',
        md: 'btn-md',
        lg: 'btn-lg',
    };

    return (
        <button
            {...props}
            disabled={disabled || isSpinning}
            className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
            style={style}
        >
            {isSpinning ? (
                <span className="btn-spinner" aria-hidden />
            ) : icon ? (
                <span className="btn-icon">{icon}</span>
            ) : null}
            {children}
            {iconRight && !isSpinning && <span className="btn-icon">{iconRight}</span>}
        </button>
    );
}
