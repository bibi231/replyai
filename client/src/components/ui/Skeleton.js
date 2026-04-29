import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Skeleton({ width = '100%', height = 16, rounded = false, className = '' }) {
    return (_jsx("div", { className: `skeleton ${rounded ? 'rounded-full' : ''} ${className}`, style: { width, height }, "aria-hidden": true }));
}
export function ReplyCardSkeleton() {
    return (_jsxs("div", { className: "reply-card-skeleton", children: [_jsxs("div", { className: "reply-card-skeleton-header", children: [_jsx(Skeleton, { width: 100, height: 20 }), _jsx(Skeleton, { width: 40, height: 20 })] }), _jsx(Skeleton, { width: "70%", height: 14, className: "mt-2" }), _jsx(Skeleton, { height: 12, className: "mt-3" }), _jsx(Skeleton, { height: 12, className: "mt-2" }), _jsx(Skeleton, { width: "85%", height: 12, className: "mt-2" }), _jsx(Skeleton, { height: 12, className: "mt-2" }), _jsx(Skeleton, { width: "60%", height: 12, className: "mt-2" })] }));
}
