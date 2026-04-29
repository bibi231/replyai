import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { logOut } from '../../lib/firebase';
export function Navbar() {
    const user = useAuthStore(s => s.user);
    const credits = useAuthStore(s => s.credits);
    const { pathname } = useLocation();
    const freeLeft = credits?.free ?? 0;
    const paidLeft = credits?.paid ?? 0;
    const hasCredits = freeLeft > 0 || paidLeft > 0;
    return (_jsx("nav", { className: "navbar", children: _jsxs("div", { className: "navbar-inner", children: [_jsxs(Link, { to: "/", className: "navbar-logo", children: [_jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: _jsx("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }) }), "ReplyAI"] }), _jsxs("div", { className: "navbar-right", children: [user && credits && (_jsxs(Link, { to: "/pricing", className: `credits-badge-link ${!hasCredits ? 'empty' : freeLeft > 0 ? 'free' : 'paid'}`, children: [_jsx("span", { className: `credits-badge-dot ${!hasCredits ? 'pulse-red' : ''}` }), freeLeft > 0
                                    ? `${freeLeft} free ${freeLeft === 1 ? 'reply' : 'replies'} left`
                                    : paidLeft > 0
                                        ? `${paidLeft} credits`
                                        : 'No credits'] })), user && (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/app", className: `navbar-link ${pathname === '/app' ? 'active' : ''}`, children: "Generator" }), _jsx(Link, { to: "/dashboard", className: `navbar-link ${pathname === '/dashboard' ? 'active' : ''}`, children: "History" }), _jsx("button", { className: "navbar-signout", onClick: logOut, children: "Sign out" })] })), !user && (_jsx(Link, { to: "/app", className: "navbar-signin", children: "Sign in" }))] })] }) }));
}
