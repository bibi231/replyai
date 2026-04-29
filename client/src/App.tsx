import React from 'react';
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

    return (
        <>
            <div className="layout-wrapper" style={{ minHeight: 'calc(100vh - 48px)', paddingBottom: '48px' }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
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
            </div>

            <TrueWebFooter />
            <PricingModal />
            <ToastContainer />
        </>
    );
}
