import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Button({ variant = 'primary', size = 'md', loading = false, isLoading = false, icon, iconRight, fullWidth, children, disabled, className = '', style, ...props }) {
    const isSpinning = loading || isLoading;
    const base = `
    inline-flex items-center justify-center gap-2 font-medium transition-all duration-150
    cursor-pointer select-none relative overflow-hidden
    disabled:opacity-40 disabled:cursor-not-allowed
  `;
    const variants = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        ghost: 'btn-ghost',
        danger: 'btn-danger',
        success: 'btn-success',
    };
    const sizes = {
        xs: 'btn-xs',
        sm: 'btn-sm',
        md: 'btn-md',
        lg: 'btn-lg',
    };
    return (_jsxs("button", { ...props, disabled: disabled || isSpinning, className: `${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`, style: style, children: [isSpinning ? (_jsx("span", { className: "btn-spinner", "aria-hidden": true })) : icon ? (_jsx("span", { className: "btn-icon", children: icon })) : null, children, iconRight && !isSpinning && _jsx("span", { className: "btn-icon", children: iconRight })] }));
}
