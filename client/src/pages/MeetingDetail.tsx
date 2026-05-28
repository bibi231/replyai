import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Spinner } from '../components/ui/Spinner';
import { Badge } from '../components/ui/Badge';
import { api } from '../lib/api';
import { Meeting, ActionItem } from '../types';
import { useCredits } from '../hooks/useCredits';
import { useDocTitle } from '../hooks/useDocTitle';

export function MeetingDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { refreshCredits } = useCredits();

    const [meeting, setMeeting] = useState<Meeting | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [editing, setEditing] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editNotes, setEditNotes] = useState('');
    const [editTags, setEditTags] = useState('');
    const [saving, setSaving] = useState(false);

    const [summarizing, setSummarizing] = useState(false);
    const [extracting, setExtracting] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);
    useDocTitle(meeting?.title || 'Meeting Detail');

    async function fetchMeeting() {
        setIsLoading(true);
        setError(null);
        try {
            const res = await api.get(`/api/meetings/${id}`);
            setMeeting(res.data.meeting);
        } catch (err: any) {
            if (err?.response?.status === 404) setError('Meeting not found.');
            else setError('Failed to load meeting.');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => { fetchMeeting(); }, [id]);

    function startEdit() {
        if (!meeting) return;
        setEditTitle(meeting.title);
        setEditNotes(meeting.rawNotes);
        setEditTags(meeting.tags.join(', '));
        setEditing(true);
    }

    async function saveEdit() {
        if (!meeting) return;
        setSaving(true);
        try {
            const res = await api.put(`/api/meetings/${id}`, {
                title: editTitle,
                rawNotes: editNotes,
                tags: editTags.split(',').map(t => t.trim()).filter(Boolean),
            });
            setMeeting(res.data.meeting);
            setEditing(false);
        } catch {
            setError('Failed to save changes.');
        } finally {
            setSaving(false);
        }
    }

    async function handleSummarize() {
        setSummarizing(true);
        setAiError(null);
        try {
            const res = await api.post(`/api/meetings/${id}/summarize`);
            setMeeting(res.data.meeting);
            refreshCredits();
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Summarization failed.';
            setAiError(msg);
        } finally {
            setSummarizing(false);
        }
    }

    async function handleExtract() {
        setExtracting(true);
        setAiError(null);
        try {
            const res = await api.post(`/api/meetings/${id}/extract`);
            setMeeting(res.data.meeting);
            refreshCredits();
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Extraction failed.';
            setAiError(msg);
        } finally {
            setExtracting(false);
        }
    }

    async function toggleItemStatus(itemId: string) {
        if (!meeting) return;
        const updated = meeting.actionItems.map(item => {
            if (item.id !== itemId) return item;
            const next = item.status === 'done' ? 'pending' : item.status === 'pending' ? 'in_progress' : 'done';
            return { ...item, status: next as ActionItem['status'] };
        });
        try {
            const res = await api.put(`/api/meetings/${id}`, { actionItems: updated });
            setMeeting(res.data.meeting);
        } catch {
            setError('Failed to update action item.');
        }
    }

    const priorityColor: Record<string, string> = {
        high: 'var(--error, #FF4757)',
        medium: 'var(--warning, #FFB547)',
        low: 'var(--text-muted)',
    };

    if (isLoading) return (
        <div className="app-layout">
            <Navbar />
            <main style={{ display: 'flex', justifyContent: 'center', padding: '140px 24px' }}><Spinner size={32} /></main>
        </div>
    );

    if (error || !meeting) return (
        <div className="app-layout">
            <Navbar />
            <main style={{ maxWidth: 800, margin: '0 auto', padding: '140px 24px', textAlign: 'center' }}>
                <p style={{ color: 'var(--error)', marginBottom: 16 }}>{error || 'Meeting not found.'}</p>
                <button onClick={() => navigate('/meetings')} style={{ padding: '10px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 700 }}>Back to Meetings</button>
            </main>
        </div>
    );

    return (
        <div className="app-layout">
            <Navbar />
            <main style={{ maxWidth: 1200, margin: '0 auto', width: '100%', padding: '100px 24px 80px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button onClick={() => navigate('/meetings')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18 }}>←</button>
                        {editing ? (
                            <input value={editTitle} onChange={e => setEditTitle(e.target.value)} style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '4px 12px', color: 'var(--text-primary)' }} />
                        ) : (
                            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28 }}>{meeting.title}</h1>
                        )}
                        <Badge variant={meeting.status === 'processed' ? 'paid' : 'free'}>{meeting.status}</Badge>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {editing ? (
                            <>
                                <button onClick={saveEdit} disabled={saving} style={{ padding: '8px 18px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 700, fontSize: 13, opacity: saving ? 0.6 : 1 }}>{saving ? 'Saving...' : 'Save'}</button>
                                <button onClick={() => setEditing(false)} style={{ padding: '8px 18px', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: 13 }}>Cancel</button>
                            </>
                        ) : (
                            <button onClick={startEdit} style={{ padding: '8px 18px', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: 13 }}>Edit</button>
                        )}
                    </div>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 8 }}>{new Date(meeting.date).toLocaleString()}</p>
                {meeting.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
                        {meeting.tags.map(t => (
                            <span key={t} style={{ fontSize: 11, padding: '2px 8px', background: 'rgba(99,102,241,0.15)', borderRadius: 999, color: 'var(--accent)' }}>{t}</span>
                        ))}
                    </div>
                )}

                {editing && (
                    <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Tags (comma-separated)</label>
                        <input value={editTags} onChange={e => setEditTags(e.target.value)} style={{ width: '100%', maxWidth: 400, padding: '8px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: 13 }} />
                    </div>
                )}

                {/* Split Layout */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }} className="meeting-split">
                    {/* Left: Notes */}
                    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: 24 }}>
                        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Meeting Notes</h3>
                        {editing ? (
                            <textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} rows={16} style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: 14, resize: 'vertical', lineHeight: 1.6 }} />
                        ) : (
                            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)' }}>{meeting.rawNotes}</pre>
                        )}
                    </div>

                    {/* Right: AI Output */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {/* AI Buttons */}
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                            <button onClick={handleSummarize} disabled={summarizing || extracting} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, var(--accent), #6366f1)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 700, fontSize: 13, opacity: summarizing ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                                {summarizing ? <><Spinner size={14} /> Summarizing...</> : '✨ Summarize (1 credit)'}
                            </button>
                            <button onClick={handleExtract} disabled={extracting || summarizing} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #6366f1, var(--accent))', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 700, fontSize: 13, opacity: extracting ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                                {extracting ? <><Spinner size={14} /> Extracting...</> : '📋 Extract Actions (1 credit)'}
                            </button>
                        </div>

                        {aiError && <p style={{ color: 'var(--error)', fontSize: 13 }}>{aiError}</p>}

                        {/* Summary */}
                        {meeting.summary && (
                            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: 24 }}>
                                <h3 style={{ fontWeight: 700, marginBottom: 12 }}>AI Summary</h3>
                                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)' }}>{meeting.summary}</pre>
                            </div>
                        )}

                        {/* Action Items */}
                        {meeting.actionItems.length > 0 && (
                            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: 24 }}>
                                <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Action Items ({meeting.actionItems.filter(i => i.status === 'done').length}/{meeting.actionItems.length})</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {meeting.actionItems.map(item => (
                                        <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', borderRadius: 'var(--radius-md)', background: item.status === 'done' ? 'rgba(0,214,143,0.06)' : 'transparent', border: '1px solid var(--border-subtle)', cursor: 'pointer' }} onClick={() => toggleItemStatus(item.id)}>
                                            <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0, marginTop: 1 }}>
                                                {item.status === 'done' ? '✅' : item.status === 'in_progress' ? '🔄' : '⬜'}
                                            </span>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: 14, textDecoration: item.status === 'done' ? 'line-through' : 'none', color: item.status === 'done' ? 'var(--text-muted)' : 'var(--text-primary)' }}>{item.text}</p>
                                                <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                                                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.assignee}</span>
                                                    <span style={{ fontSize: 11, color: priorityColor[item.priority], fontWeight: 600 }}>{item.priority}</span>
                                                    {item.dueDate && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Due: {new Date(item.dueDate).toLocaleDateString()}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Empty state for AI */}
                        {!meeting.summary && meeting.actionItems.length === 0 && (
                            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: 40, textAlign: 'center' }}>
                                <p style={{ fontSize: 36, marginBottom: 12 }}>🤖</p>
                                <h3 style={{ fontWeight: 700, marginBottom: 8 }}>AI Ready</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Click Summarize or Extract Actions to process your meeting notes with AI. Each action costs 1 credit.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <style>{`
                @media (max-width: 768px) {
                    .meeting-split { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
}
