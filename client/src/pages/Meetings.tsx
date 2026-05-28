import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Spinner } from '../components/ui/Spinner';
import { Badge } from '../components/ui/Badge';
import { api } from '../lib/api';
import { Meeting, MeetingStats } from '../types';
import { useDocTitle } from '../hooks/useDocTitle';

export function Meetings() {
    const navigate = useNavigate();
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [stats, setStats] = useState<MeetingStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showNew, setShowNew] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newNotes, setNewNotes] = useState('');
    const [creating, setCreating] = useState(false);
    const [search, setSearch] = useState('');
    useDocTitle('Meetings', 'AI-powered meeting notes, summaries, and action items.');

    async function fetchData() {
        setIsLoading(true);
        setError(null);
        try {
            const [meetRes, statsRes] = await Promise.all([
                api.get('/api/meetings'),
                api.get('/api/meetings/stats/summary'),
            ]);
            setMeetings(meetRes.data.meetings);
            setStats(statsRes.data);
        } catch {
            setError('Failed to load meetings.');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => { fetchData(); }, []);

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        if (!newTitle.trim() || !newNotes.trim()) return;
        setCreating(true);
        try {
            const res = await api.post('/api/meetings', { title: newTitle, rawNotes: newNotes });
            navigate(`/meetings/${res.data.meeting.id}`);
        } catch {
            setError('Failed to create meeting.');
        } finally {
            setCreating(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this meeting?')) return;
        try {
            await api.delete(`/api/meetings/${id}`);
            setMeetings(prev => prev.filter(m => m.id !== id));
        } catch {
            setError('Failed to delete meeting.');
        }
    }

    const filtered = meetings.filter(m =>
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="app-layout">
            <Navbar />
            <main style={{ maxWidth: 1100, margin: '0 auto', width: '100%', padding: '100px 24px 80px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 32, marginBottom: 4 }}>Meetings</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>AI-powered meeting notes & action items.</p>
                    </div>
                    <button
                        onClick={() => setShowNew(!showNew)}
                        style={{ padding: '10px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}
                    >
                        + New Meeting
                    </button>
                </div>

                {/* Stats */}
                {stats && (
                    <div className="stats-strip" style={{ marginBottom: 24 }}>
                        <div className="stat-card">
                            <span className="stat-label">Total</span>
                            <span className="stat-value">{stats.totalMeetings}</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-label">Action Items</span>
                            <span className="stat-value">{stats.totalActionItems}</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-label">Completed</span>
                            <span className="stat-value">{stats.completedItems}</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-label">Pending</span>
                            <span className="stat-value">{stats.pendingItems}</span>
                        </div>
                    </div>
                )}

                {/* New Meeting Form */}
                {showNew && (
                    <form onSubmit={handleCreate} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: 24, marginBottom: 24 }}>
                        <h3 style={{ marginBottom: 16, fontWeight: 700 }}>New Meeting</h3>
                        <input
                            type="text"
                            placeholder="Meeting title..."
                            value={newTitle}
                            onChange={e => setNewTitle(e.target.value)}
                            maxLength={500}
                            style={{ width: '100%', padding: '10px 14px', marginBottom: 12, background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: 14 }}
                        />
                        <textarea
                            placeholder="Paste your meeting notes here..."
                            value={newNotes}
                            onChange={e => setNewNotes(e.target.value)}
                            rows={6}
                            style={{ width: '100%', padding: '10px 14px', marginBottom: 16, background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: 14, resize: 'vertical' }}
                        />
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button type="submit" disabled={creating} style={{ padding: '10px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 700, opacity: creating ? 0.6 : 1 }}>
                                {creating ? 'Creating...' : 'Create & Open'}
                            </button>
                            <button type="button" onClick={() => setShowNew(false)} style={{ padding: '10px 24px', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {/* Search */}
                <input
                    type="text"
                    placeholder="Search meetings..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ width: '100%', maxWidth: 400, padding: '10px 14px', marginBottom: 20, background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: 14 }}
                />

                {error && (
                    <div style={{ textAlign: 'center', padding: 32 }}>
                        <p style={{ color: 'var(--error)', marginBottom: 12 }}>{error}</p>
                        <button onClick={fetchData} style={{ padding: '8px 20px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 700 }}>Retry</button>
                    </div>
                )}

                {!error && isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><Spinner size={32} /></div>
                ) : !error && filtered.length === 0 ? (
                    <div className="empty-state" style={{ minHeight: 260 }}>
                        <h3 className="empty-state-title">{meetings.length === 0 ? 'No meetings yet' : 'No matches'}</h3>
                        <p className="empty-state-sub">{meetings.length === 0 ? 'Create your first meeting to get started.' : 'Try a different search term.'}</p>
                    </div>
                ) : !error ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                        {filtered.map(m => (
                            <div key={m.id} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: 20, display: 'flex', flexDirection: 'column', gap: 12, transition: 'border-color 0.2s', cursor: 'pointer' }}
                                onClick={() => navigate(`/meetings/${m.id}`)}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h3 style={{ fontWeight: 700, fontSize: 16, flex: 1, marginRight: 8 }}>{m.title}</h3>
                                    <Badge variant={m.status === 'processed' ? 'paid' : 'free'}>{m.status}</Badge>
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{new Date(m.date).toLocaleDateString()}</p>
                                {m.summary && (
                                    <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{m.summary}</p>
                                )}
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                                    {m.tags.map(t => (
                                        <span key={t} style={{ fontSize: 11, padding: '2px 8px', background: 'var(--accent-bg, rgba(99,102,241,0.15))', borderRadius: 999, color: 'var(--accent)' }}>{t}</span>
                                    ))}
                                    {m.actionItems.length > 0 && (
                                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.actionItems.filter(i => i.status === 'done').length}/{m.actionItems.length} done</span>
                                    )}
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(m.id); }}
                                    style={{ alignSelf: 'flex-end', fontSize: 12, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}
                                    title="Delete"
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                    </div>
                ) : null}
            </main>
        </div>
    );
}
