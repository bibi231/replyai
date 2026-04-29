import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Spinner } from '../components/ui/Spinner';
import { Badge } from '../components/ui/Badge';
import { api } from '../lib/api';
import { ReplyTemplate } from '../types';

interface GenerationRecord {
    id: string;
    emailSnippet: string;
    tone: string;
    outputLanguage?: string;
    creditType: string;
    createdAt: string;
}

interface Stats {
    total: number;
    tones: Record<string, number>;
    languages: Record<string, number>;
}

export function Dashboard() {
    const [history, setHistory] = useState<GenerationRecord[]>([]);
    const [templates, setTemplates] = useState<ReplyTemplate[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [activeTab, setActiveTab] = useState<'replies' | 'templates'>('replies');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const [histRes, tempRes, statsRes] = await Promise.all([
                    api.get('/api/reply/history'),
                    api.get('/api/templates'),
                    api.get('/api/reply/stats')
                ]);
                setHistory(histRes.data);
                setTemplates(tempRes.data);
                setStats(statsRes.data);
            } catch (err) {
                setError('Failed to load dashboard data');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    async function handleDeleteTemplate(id: string) {
        if (!confirm('Are you sure you want to delete this template?')) return;
        try {
            await api.delete(`/api/templates/${id}`);
            setTemplates(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            console.error('Failed to delete template');
        }
    }

    function handleCopy(id: string, text: string) {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    }

    return (
        <div className="app-layout">
            <Navbar />
            <main style={{ maxWidth: 1100, margin: '0 auto', width: '100%', padding: '100px 24px 80px' }}>
                <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 32, marginBottom: 8 }}>Dashboard</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Overview of your AI communication assistant.</p>

                {/* Stats Strip */}
                {stats && (
                    <div className="stats-strip">
                        <div className="stat-card">
                            <span className="stat-label">Total Drafts</span>
                            <span className="stat-value">{stats.total}</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-label">Main Tone</span>
                            <span className="stat-value" style={{ textTransform: 'capitalize' }}>
                                {Object.entries(stats.tones).sort((a,b) => b[1] - a[1])[0]?.[0] || '—'}
                            </span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-label">Top Language</span>
                            <span className="stat-value" style={{ textTransform: 'uppercase' }}>
                                {Object.entries(stats.languages).sort((a,b) => b[1] - a[1])[0]?.[0] || '—'}
                            </span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-label">Templates</span>
                            <span className="stat-value">{templates.length}</span>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="dashboard-tabs">
                    <button 
                        className={`dashboard-tab ${activeTab === 'replies' ? 'active' : ''}`}
                        onClick={() => setActiveTab('replies')}
                    >
                        Recent Replies
                    </button>
                    <button 
                        className={`dashboard-tab ${activeTab === 'templates' ? 'active' : ''}`}
                        onClick={() => setActiveTab('templates')}
                    >
                        My Templates ({templates.length})
                    </button>
                </div>

                {isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
                        <Spinner size={32} />
                    </div>
                ) : activeTab === 'replies' ? (
                    history.length === 0 ? (
                        <div className="empty-state" style={{ minHeight: 300 }}>
                            <h3 className="empty-state-title">No history yet</h3>
                            <p className="empty-state-sub">Start generating replies to see your activity here.</p>
                        </div>
                    ) : (
                        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', textAlign: 'left', fontSize: 14, borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                            <th style={{ padding: '16px 20px', fontWeight: 500, color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '.08em' }}>Date</th>
                                            <th style={{ padding: '16px 20px', fontWeight: 500, color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '.08em' }}>Snippet</th>
                                            <th style={{ padding: '16px 20px', fontWeight: 500, color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '.08em' }}>Tone / Lang</th>
                                            <th style={{ padding: '16px 20px', fontWeight: 500, color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '.08em' }}>Credit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map((record) => (
                                            <tr key={record.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.1s' }}>
                                                <td style={{ padding: '14px 20px', color: 'var(--text-muted)', whiteSpace: 'nowrap', fontSize: 13 }}>
                                                    {new Date(record.createdAt).toLocaleDateString()}
                                                </td>
                                                <td style={{ padding: '14px 20px', color: 'var(--text-primary)', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {record.emailSnippet || 'No snippet'}
                                                </td>
                                                <td style={{ padding: '14px 20px', textTransform: 'capitalize', color: 'var(--text-secondary)' }}>
                                                    {record.tone} · <span style={{ textTransform: 'uppercase', fontSize: 11, fontWeight: 700 }}>{record.outputLanguage}</span>
                                                </td>
                                                <td style={{ padding: '14px 20px' }}>
                                                    <Badge variant={record.creditType === 'free' ? 'free' : 'paid'}>
                                                        {record.creditType}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                ) : (
                    /* Templates View */
                    <div className="templates-grid">
                        {templates.length === 0 ? (
                            <div className="empty-state" style={{ minHeight: 300, gridColumn: '1 / -1' }}>
                                <h3 className="empty-state-title">No templates saved</h3>
                                <p className="empty-state-sub">Save any generated draft as a template to reuse it later.</p>
                            </div>
                        ) : (
                            templates.map(tmp => (
                                <div key={tmp.id} className="template-card">
                                    <div className="template-card-header">
                                        <h3 className="template-card-title">{tmp.title}</h3>
                                        <div className="template-card-actions">
                                            <button 
                                                className={`action-icon-btn ${copiedId === tmp.id ? 'active' : ''}`}
                                                onClick={() => handleCopy(tmp.id, tmp.body)}
                                                title="Copy to clipboard"
                                            >
                                                {copiedId === tmp.id ? '✓' : '📋'}
                                            </button>
                                            <button 
                                                className="action-icon-btn danger"
                                                onClick={() => handleDeleteTemplate(tmp.id)}
                                                title="Delete"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                    <p className="template-card-body">{tmp.body}</p>
                                    <div className="template-card-footer">
                                        <span className="template-tag">{tmp.tone}</span>
                                        <span className="template-date">{new Date(tmp.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
