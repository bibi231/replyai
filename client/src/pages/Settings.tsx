import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { useAuthStore } from '../store/authStore';
import { toast } from '../components/ui/Toast';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

type SettingsTab = 'account' | 'preferences' | 'billing' | 'api';

export function Settings() {
    const user = useAuthStore(s => s.user);
    const credits = useAuthStore(s => s.credits);
    const [activeTab, setActiveTab] = useState<SettingsTab>('account');
    
    // Form States
    const [name, setName] = useState(user?.displayName || '');
    const [language, setLanguage] = useState('en');
    const [tone, setTone] = useState('professional');
    const [showTips, setShowTips] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        async function fetchSettings() {
            try {
                const res = await api.get('/api/user/settings');
                setLanguage(res.data.defaultLanguage);
                setTone(res.data.defaultTone);
                setShowTips(res.data.showTips);
            } catch (err) {
                console.error("Failed to fetch settings", err);
            } finally {
                setIsLoading(false);
            }
        }
        if (user) fetchSettings();
    }, [user]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await api.post('/api/user/settings', {
                defaultLanguage: language,
                defaultTone: tone,
                showTips
            });
            toast('Settings updated successfully!', 'success');
        } catch (err) {
            toast('Failed to update settings', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { id: 'account', label: 'Account', icon: '👤' },
        { id: 'preferences', label: 'Preferences', icon: '⚙️' },
        { id: 'billing', label: 'Plans & Billing', icon: '💳' },
        { id: 'api', label: 'API Keys', icon: '🔑' },
    ];

    if (isLoading && !user) {
        return <div className="settings-page"><Navbar /><div className="settings-hero">Loading profile...</div></div>;
    }

    return (
        <div className="settings-page">
            <Navbar />
            
            <div className="settings-hero">
                <div className="settings-hero-inner">
                    <div className="user-profile-header">
                        <div className="user-avatar-large">
                            {user?.photoURL ? <img src={user.photoURL} alt="" /> : (user?.displayName?.[0] || 'U')}
                        </div>
                        <div className="user-meta">
                            <h1>{user?.displayName || 'User Profile'}</h1>
                            <p>{user?.email}</p>
                        </div>
                    </div>
                    <div className="user-stats-brief">
                        <div className="stat-pill">
                            <span className="stat-label">Credits Available</span>
                            <span className="stat-value">{(credits?.free || 0) + (credits?.paid || 0)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="settings-layout">
                <aside className="settings-sidebar">
                    <nav className="settings-nav">
                        {tabs.map(tab => (
                            <button 
                                key={tab.id}
                                className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id as SettingsTab)}
                            >
                                <span className="nav-icon">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </aside>

                <div className="settings-content">
                    {activeTab === 'account' && (
                        <div className="content-fade-in">
                            <h2>Profile Information</h2>
                            <form onSubmit={handleSave} className="settings-form-v2">
                                <div className="input-group-v2">
                                    <label>Display Name</label>
                                    <input 
                                        type="text" 
                                        value={name} 
                                        onChange={e => setName(e.target.value)}
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div className="input-group-v2">
                                    <label>Email Address</label>
                                    <input type="text" value={user?.email || ''} disabled className="is-disabled" />
                                    <span className="field-hint">Email is managed via Google Account</span>
                                </div>
                                <button type="submit" className="settings-save-btn" disabled={isSaving}>
                                    {isSaving ? 'Updating...' : 'Save Changes'}
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'preferences' && (
                        <div className="content-fade-in">
                            <h2>App Preferences</h2>
                            <form onSubmit={handleSave} className="settings-form-v2">
                                <div className="input-group-v2">
                                    <label>Default Output Language</label>
                                    <select value={language} onChange={e => setLanguage(e.target.value)}>
                                        <option value="en">English (Global)</option>
                                        <option value="en-ng">Nigerian English</option>
                                        <option value="pcm">Nigerian Pidgin</option>
                                        <option value="yo">Yoruba</option>
                                        <option value="ha">Hausa</option>
                                        <option value="ig">Igbo</option>
                                    </select>
                                </div>

                                <div className="input-group-v2">
                                    <label>Default Reply Tone</label>
                                    <select value={tone} onChange={e => setTone(e.target.value)}>
                                        <option value="professional">Professional</option>
                                        <option value="friendly">Friendly</option>
                                        <option value="urgent">Urgent</option>
                                        <option value="concise">Concise</option>
                                        <option value="creative">Creative</option>
                                    </select>
                                </div>

                                <div className="toggle-group-v2">
                                    <div className="toggle-info">
                                        <h3>Show Helper Tips</h3>
                                        <p>Display AI suggestions and usage hints in the generator</p>
                                    </div>
                                    <div 
                                        className={`toggle-switch ${showTips ? 'active' : ''}`}
                                        onClick={() => setShowTips(!showTips)}
                                    ></div>
                                </div>

                                <button type="submit" className="settings-save-btn" disabled={isSaving}>
                                    {isSaving ? 'Updating...' : 'Save Preferences'}
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'billing' && (
                        <div className="content-fade-in">
                            <h2>Plans & Billing</h2>
                            <div className="billing-summary-card">
                                <div className="plan-badge">{(credits?.paid || 0) > 0 ? 'Premium User' : 'Free Tier'}</div>
                                <p>
                                    {(credits?.paid || 0) > 0 
                                        ? `You have ${credits?.paid} paid credits remaining.` 
                                        : 'You are currently using free monthly credits. Upgrade for more.'}
                                </p>
                                <Link to="/pricing" className="upgrade-link">Buy more credits →</Link>
                            </div>
                        </div>
                    )}

                    {activeTab === 'api' && (
                        <div className="content-fade-in">
                            <h2>Developer API</h2>
                            <p className="field-hint" style={{marginBottom: 24}}>Enterprise integration keys for TrueWeb Solutions Network.</p>
                            <div className="api-key-placeholder">
                                <code>**************************</code>
                                <button className="btn-ghost-sm" onClick={() => toast('API keys are restricted to Business accounts', 'info')}>Request Access</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'account' && (
                        <div className="danger-zone-v2">
                            <h3>Danger Zone</h3>
                            <div className="danger-card-v2">
                                <div>
                                    <p style={{fontWeight: 600, color: 'var(--text-primary)'}}>Delete Account</p>
                                    <p>Permanently remove all your data and generated replies.</p>
                                </div>
                                <button className="btn-danger-outline" style={{color: 'var(--error)', border: '1px solid var(--error)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer'}}>Delete</button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
