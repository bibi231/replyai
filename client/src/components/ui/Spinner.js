import { jsx as _jsx } from "react/jsx-runtime";
export function Spinner({ size = 20, className = '' }) {
    return (_jsx("div", { className: `spinner-ring ${className}`, style: { width: size, height: size }, "aria-label": "Loading" }));
}
