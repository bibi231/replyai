import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { AppPage } from './pages/AppPage';
import { Pricing } from './pages/Pricing';
import { Dashboard } from './pages/Dashboard';
import { AuthGuard } from './components/auth/AuthGuard';
import { PricingModal } from './components/billing/PricingModal';
import { ToastContainer } from './components/ui/Toast';
import { useAuth } from './hooks/useAuth';

export default function App() {
    useAuth();

    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route
                    path="/app"
                    element={
                        <AuthGuard>
                            <AppPage />
                        </AuthGuard>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <AuthGuard>
                            <Dashboard />
                        </AuthGuard>
                    }
                />
            </Routes>

            <PricingModal />
            <ToastContainer />
        </>
    );
}
