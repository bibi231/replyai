import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { AppPage } from './pages/AppPage';
import { Pricing } from './pages/Pricing';
import { Dashboard } from './pages/Dashboard';
import { AuthGuard } from './components/auth/AuthGuard';
import { TrueWebFooter } from './components/layout/TrueWebFooter';
import { PricingModal } from './components/billing/PricingModal';
import { ToastContainer } from './components/ui/Toast';
import { useAuth } from './hooks/useAuth';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
export default function App() {
    useAuth();
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "layout-wrapper", style: { minHeight: 'calc(100vh - 48px)', paddingBottom: '48px' }, children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/pricing", element: _jsx(Pricing, {}) }), _jsx(Route, { path: "/privacy", element: _jsx(Privacy, {}) }), _jsx(Route, { path: "/terms", element: _jsx(Terms, {}) }), _jsx(Route, { path: "/app", element: _jsx(AuthGuard, { children: _jsx(AppPage, {}) }) }), _jsx(Route, { path: "/dashboard", element: _jsx(AuthGuard, { children: _jsx(Dashboard, {}) }) })] }) }), _jsx(TrueWebFooter, {}), _jsx(PricingModal, {}), _jsx(ToastContainer, {})] }));
}
