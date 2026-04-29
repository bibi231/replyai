import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useAuthStore } from '../../store/authStore';
import { AuthModal } from './AuthModal';
import { Spinner } from '../ui/Spinner';
export function AuthGuard({ children }) {
    const { user, isAuthLoading } = useAuthStore();
    if (isAuthLoading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx(Spinner, { size: 32, className: "text-[var(--accent)]" }) }));
    }
    if (!user) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-[var(--bg-primary)]", children: _jsx(AuthModal, { isOpen: true }) }));
    }
    return _jsx(_Fragment, { children: children });
}
