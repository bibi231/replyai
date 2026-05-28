import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Spinner } from '../components/ui/Spinner';
import { Badge } from '../components/ui/Badge';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { ReplyTemplate, MeetingStats, Meeting } from '../types';

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
    const [meetingStats, setMeetingStats] = useState<MeetingStats | null>(null);
    const [recentMeetings, setRecentMeetings] = useState<Meeting[]>([]);
    const [activeTab, setActiveTab] = useState<'replies' | 'templates' | 'meetings'>('replies');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    async function fetchData() {
        setIsLoading(true);
        setError(null);
        try {
            const [histRes, tempRes, statsRes, mStatsRes, mListRes] = await Promise.all([
                api.get('/api/reply/history'),
                api.get('/api/templates'),
                api.get('/api/reply/stats'),
                api.get('/api/meetings/stats/summary').catch(() => ({ data: null })),
                api.get('/api/meetings').catch(() => ({ data: { meetings: [] } })),
            ]);
            setHistory(histRes.data);
            setTemplates(tempRes.data);
            setStats(statsRes.data);
            if (mStatsRes.data) setMeetingStats(mStatsRes.data);
            setRecentMeetings((mListRes.data.meetings || []).slice(0, 5));
        } catch (err: any) {
            console.error('[Dashboard] fetch error:', err?.response?.status, err?.message);
            setError('Failed to load dashboard data. Check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => { fetchData(); }, []);

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
                        {meetingStats && (
                            <div className="stat-card">
                                <span className="stat-label">Meetings</span>
                                <span className="stat-value">{meetingStats.totalMeetings}</span>
                            </div>
                        )}
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
                    <button
                        className={`dashboard-tab ${activeTab === 'meetings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('meetings')}
                    >
                        Recent Meetings ({recentMeetings.length})
                    </button>
                </div>

                {error && (
                    <div style={{ textAlign: 'center', padding: 48 }}>
                        <p style={{ color: 'var(--error)', marginBottom: 16 }}>{error}</p>
                        <button
                            onClick={fetchData}
                            style={{ padding: '10px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 700 }}
                        >
                            Retry
                        </button>
                    </div>
                )}

                {!error && isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
                        <Spinner size={32} />
                    </div>
                ) : !error && activeTab === 'replies' ? (
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
                ) : !error ? (
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
                ) : !error && activeTab === 'meetings' ? (
                    recentMeetings.length === 0 ? (
                        <div className="empty-state" style={{ minHeight: 300 }}>
                            <h3 className="empty-state-title">No meetings yet</h3>
                            <p className="empty-state-sub">Create your first meeting to see it here.</p>
                            <Link to="/meetings" style={{ marginTop: 16, display: 'inline-block', padding: '10px 24px', background: 'var(--accent)', color: '#fff', borderRadius: 'var(--radius-md)', fontWeight: 700, textDecoration: 'none' }}>Go to Meetings</Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {recentMeetings.map(m => (
                                <Link to={`/meetings/${m.id}`} key={m.id} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '16px 20px', textDecoration: 'none', color: 'inherit', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, transition: 'border-color 0.2s' }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{m.title}</p>
                                        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(m.date).toLocaleDateString()} · {m.actionItems.length} action items</p>
                                    </div>
                                    <Badge variant={m.status === 'processed' ? 'paid' : 'free'}>{m.status}</Badge>
                                </Link>
                            ))}
                            <Link to="/meetings" style={{ textAlign: 'center', color: 'var(--accent)', fontSize: 14, fontWeight: 600, padding: 8 }}>View all meetings →</Link>
                        </div>
                    )
                ) : null}
            </main>
        </div>
    );
}
