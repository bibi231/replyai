import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { useAuthStore } from '../store/authStore';
import { toast } from '../components/ui/Toast';

export function Settings() {
    const user = useAuthStore(s => s.user);
    const [name, setName] = useState(user?.displayName || '');
    const [language, setLanguage] = useState('English');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        // Simulate API call for settings update
        await new Promise(r => setTimeout(r, 1000));
        setIsSaving(false);
        toast('Settings updated successfully!', 'success');
    };

    return (
        <div className="settings-page">
            <Navbar />
            
            <main className="settings-container">
                <header className="settings-header">
                    <h1>Account Settings</h1>
                    <p>Manage your ReplyAI profile and preferences.</p>
                </header>

                <div className="settings-card">
                    <form onSubmit={handleSave} className="settings-form">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={e => setName(e.target.value)}
                                className="form-input"
                                placeholder="Your Name"
                            />
                        </div>

                        <div className="form-group">
                            <label>Default Reply Language</label>
                            <select 
                                value={language} 
                                onChange={e => setLanguage(e.target.value)}
                                className="form-select"
                            >
                                <option>English</option>
                                <option>Pidgin</option>
                                <option>Yoruba</option>
                                <option>Hausa</option>
                                <option>French</option>
                            </select>
                            <p className="form-help">This will be the pre-selected language in the extension.</p>
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <input 
                                type="email" 
                                value={user?.email || ''} 
                                disabled 
                                className="form-input disabled"
                            />
                            <p className="form-help">Email is managed via your Google account.</p>
                        </div>

                        <div className="settings-actions">
                            <button type="submit" className="btn-primary" disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="danger-zone">
                    <h2 className="danger-title">Danger Zone</h2>
                    <div className="danger-card">
                        <div className="danger-info">
                            <h3>Delete Account</h3>
                            <p>Once you delete your account, there is no going back. Please be certain.</p>
                        </div>
                        <button className="btn-error btn-sm">Delete Account</button>
                    </div>
                </div>
            </main>
        </div>
    );
}
