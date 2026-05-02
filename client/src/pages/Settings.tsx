import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Navbar } from '../components/layout/Navbar';
import { UnifiedFooter } from '../components/layout/UnifiedFooter';
import { api } from '../lib/api';
import type { ToneType, OutputLanguage } from '../types/index';
import { OUTPUT_LANGUAGES } from '../types/index';

type SettingsTab = 'account' | 'preferences' | 'billing';

export function Settings() {
    const { user, credits, setUser } = useAuthStore();
    const [activeTab, setActiveTab] = useState<SettingsTab>('account');
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [defaultTone, setDefaultTone] = useState<ToneType>('professional');
    const [defaultLanguage, setDefaultLanguage] = useState<OutputLanguage>('en');
    const [showTips, setShowTips] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

    // Load persisted settings from localStorage (not Firebase User, which doesn't store these)
    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || '');
            try {
                const saved = JSON.parse(localStorage.getItem('replyai:prefs') || '{}');
                if (saved.defaultTone) setDefaultTone(saved.defaultTone);
                if (saved.defaultLanguage) setDefaultLanguage(saved.defaultLanguage);
                if (typeof saved.showTips === 'boolean') setShowTips(saved.showTips);
            } catch { /* ignore parse errors */ }
        }
    }, [user]);

    async function handleSave() {
        setIsSaving(true);
        setSaveStatus('idle');
        try {
            // Persist preferences locally
            localStorage.setItem('replyai:prefs', JSON.stringify({ defaultTone, defaultLanguage, showTips }));
            // Update server-side settings (display name etc.)
            await api.put('/api/user/settings', {
                displayName,
                defaultTone,
                defaultLanguage,
                showTips
            });
            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } catch (err) {
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
        }
    }

    const tabs: { id: SettingsTab; label: string; icon: string }[] = [
        { id: 'account', label: 'My Account', icon: '👤' },
        { id: 'preferences', label: 'AI Preferences', icon: '⚡' },
        { id: 'billing', label: 'Credits & Billing', icon: '💳' },
    ];

    return (
        <div className="layout-wrapper flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold font-syne mb-2">Workspace Settings</h1>
                    <p className="text-muted text-sm">Manage your account, AI behavior, and credit balance.</p>
                </div>

                <div className="settings-container-v2">
                    {/* Sidebar */}
                    <div className="settings-sidebar">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`settings-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <span className="tab-icon">{tab.icon}</span>
                                <span className="tab-label">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Content Panel */}
                    <div className="settings-content-panel">
                        {activeTab === 'account' && (
                            <div className="settings-section anim-fade-in">
                                <h3 className="section-title">Public Profile</h3>
                                <div className="space-y-6">
                                    <div className="control-group">
                                        <label className="control-label">Full Name</label>
                                        <input
                                            type="text"
                                            className="control-input"
                                            value={displayName}
                                            onChange={e => setDisplayName(e.target.value)}
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    <div className="control-group opacity-60">
                                        <label className="control-label">Email Address (Read-only)</label>
                                        <input
                                            type="email"
                                            className="control-input bg-base"
                                            value={user?.email || ''}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'preferences' && (
                            <div className="settings-section anim-fade-in">
                                <h3 className="section-title">Generation Defaults</h3>
                                <p className="section-desc">These settings will be pre-selected when you open the AI generator.</p>
                                
                                <div className="space-y-8 mt-6">
                                    <div className="control-group">
                                        <label className="control-label">Default Tone</label>
                                        <div className="grid grid-cols-2 gap-3 mt-2">
                                            {['professional', 'friendly', 'firm', 'apologetic'].map((t) => (
                                                <button
                                                    key={t}
                                                    className={`option-card ${defaultTone === t ? 'active' : ''}`}
                                                    onClick={() => setDefaultTone(t as ToneType)}
                                                >
                                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="control-group">
                                        <label className="control-label">Default Reply Language</label>
                                        <select 
                                            className="control-select mt-2"
                                            value={defaultLanguage}
                                            onChange={e => setDefaultLanguage(e.target.value as OutputLanguage)}
                                        >
                                            {Object.entries(OUTPUT_LANGUAGES).map(([key, val]) => (
                                                <option key={key} value={key}>{val.label} {val.icon}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="control-group border-t border-subtle pt-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <label className="block font-bold">Show Application Tips</label>
                                                <span className="text-xs text-muted">Show helpful hints when using the generator</span>
                                            </div>
                                            <button 
                                                className={`toggle-switch ${showTips ? 'on' : ''}`}
                                                onClick={() => setShowTips(!showTips)}
                                            >
                                                <div className="toggle-knob" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'billing' && (
                            <div className="settings-section anim-fade-in">
                                <h3 className="section-title">Manage Credits</h3>
                                <div className="credits-summary-card">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm font-medium">Available Balance</span>
                                        <a href="/pricing" className="text-xs font-bold text-accent">Buy More →</a>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="balance-info">
                                            <span className="balance-val">{credits?.free || 0}</span>
                                            <span className="balance-label">Free Monthly</span>
                                        </div>
                                        <div className="balance-info border-l border-subtle pl-4">
                                            <span className="balance-val">{credits?.paid || 0}</span>
                                            <span className="balance-label">Paid Balance</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-8 border-t border-subtle pt-6">
                                    <h4 className="text-sm font-bold mb-4">Top-up History</h4>
                                    <div className="empty-state-small">
                                        <span className="opacity-30">No recent payments found.</span>
                                    </div>
                                </div>
                            </div>
                        )}


                        <div className="settings-footer">
                            {saveStatus === 'success' && (
                                <span className="text-green-400 text-sm font-medium">✓ Settings saved</span>
                            )}
                            {saveStatus === 'error' && (
                                <span className="text-red-400 text-sm font-medium">Failed to save — try again</span>
                            )}
                            <button
                                className="save-btn"
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
