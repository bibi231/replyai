import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Spinner } from '../components/ui/Spinner';
import { Badge } from '../components/ui/Badge';
import { api } from '../lib/api';
export function Dashboard() {
    const [history, setHistory] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [stats, setStats] = useState(null);
    const [activeTab, setActiveTab] = useState('replies');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copiedId, setCopiedId] = useState(null);
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
            }
            catch (err) {
                setError('Failed to load dashboard data');
                console.error(err);
            }
            finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);
    async function handleDeleteTemplate(id) {
        if (!confirm('Are you sure you want to delete this template?'))
            return;
        try {
            await api.delete(`/api/templates/${id}`);
            setTemplates(prev => prev.filter(t => t.id !== id));
        }
        catch (err) {
            console.error('Failed to delete template');
        }
    }
    function handleCopy(id, text) {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    }
    return (_jsxs("div", { className: "app-layout", children: [_jsx(Navbar, {}), _jsxs("main", { style: { maxWidth: 1100, margin: '0 auto', width: '100%', padding: '100px 24px 80px' }, children: [_jsx("h1", { style: { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 32, marginBottom: 8 }, children: "Dashboard" }), _jsx("p", { style: { color: 'var(--text-secondary)', marginBottom: 32 }, children: "Overview of your AI communication assistant." }), stats && (_jsxs("div", { className: "stats-strip", children: [_jsxs("div", { className: "stat-card", children: [_jsx("span", { className: "stat-label", children: "Total Drafts" }), _jsx("span", { className: "stat-value", children: stats.total })] }), _jsxs("div", { className: "stat-card", children: [_jsx("span", { className: "stat-label", children: "Main Tone" }), _jsx("span", { className: "stat-value", style: { textTransform: 'capitalize' }, children: Object.entries(stats.tones).sort((a, b) => b[1] - a[1])[0]?.[0] || '—' })] }), _jsxs("div", { className: "stat-card", children: [_jsx("span", { className: "stat-label", children: "Top Language" }), _jsx("span", { className: "stat-value", style: { textTransform: 'uppercase' }, children: Object.entries(stats.languages).sort((a, b) => b[1] - a[1])[0]?.[0] || '—' })] }), _jsxs("div", { className: "stat-card", children: [_jsx("span", { className: "stat-label", children: "Templates" }), _jsx("span", { className: "stat-value", children: templates.length })] })] })), _jsxs("div", { className: "dashboard-tabs", children: [_jsx("button", { className: `dashboard-tab ${activeTab === 'replies' ? 'active' : ''}`, onClick: () => setActiveTab('replies'), children: "Recent Replies" }), _jsxs("button", { className: `dashboard-tab ${activeTab === 'templates' ? 'active' : ''}`, onClick: () => setActiveTab('templates'), children: ["My Templates (", templates.length, ")"] })] }), isLoading ? (_jsx("div", { style: { display: 'flex', justifyContent: 'center', padding: 48 }, children: _jsx(Spinner, { size: 32 }) })) : activeTab === 'replies' ? (history.length === 0 ? (_jsxs("div", { className: "empty-state", style: { minHeight: 300 }, children: [_jsx("h3", { className: "empty-state-title", children: "No history yet" }), _jsx("p", { className: "empty-state-sub", children: "Start generating replies to see your activity here." })] })) : (_jsx("div", { style: { background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }, children: _jsx("div", { style: { overflowX: 'auto' }, children: _jsxs("table", { style: { width: '100%', textAlign: 'left', fontSize: 14, borderCollapse: 'collapse' }, children: [_jsx("thead", { children: _jsxs("tr", { style: { borderBottom: '1px solid var(--border-subtle)' }, children: [_jsx("th", { style: { padding: '16px 20px', fontWeight: 500, color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '.08em' }, children: "Date" }), _jsx("th", { style: { padding: '16px 20px', fontWeight: 500, color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '.08em' }, children: "Snippet" }), _jsx("th", { style: { padding: '16px 20px', fontWeight: 500, color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '.08em' }, children: "Tone / Lang" }), _jsx("th", { style: { padding: '16px 20px', fontWeight: 500, color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '.08em' }, children: "Credit" })] }) }), _jsx("tbody", { children: history.map((record) => (_jsxs("tr", { style: { borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.1s' }, children: [_jsx("td", { style: { padding: '14px 20px', color: 'var(--text-muted)', whiteSpace: 'nowrap', fontSize: 13 }, children: new Date(record.createdAt).toLocaleDateString() }), _jsx("td", { style: { padding: '14px 20px', color: 'var(--text-primary)', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }, children: record.emailSnippet || 'No snippet' }), _jsxs("td", { style: { padding: '14px 20px', textTransform: 'capitalize', color: 'var(--text-secondary)' }, children: [record.tone, " \u00B7 ", _jsx("span", { style: { textTransform: 'uppercase', fontSize: 11, fontWeight: 700 }, children: record.outputLanguage })] }), _jsx("td", { style: { padding: '14px 20px' }, children: _jsx(Badge, { variant: record.creditType === 'free' ? 'free' : 'paid', children: record.creditType }) })] }, record.id))) })] }) }) }))) : (
                    /* Templates View */
                    _jsx("div", { className: "templates-grid", children: templates.length === 0 ? (_jsxs("div", { className: "empty-state", style: { minHeight: 300, gridColumn: '1 / -1' }, children: [_jsx("h3", { className: "empty-state-title", children: "No templates saved" }), _jsx("p", { className: "empty-state-sub", children: "Save any generated draft as a template to reuse it later." })] })) : (templates.map(tmp => (_jsxs("div", { className: "template-card", children: [_jsxs("div", { className: "template-card-header", children: [_jsx("h3", { className: "template-card-title", children: tmp.title }), _jsxs("div", { className: "template-card-actions", children: [_jsx("button", { className: `action-icon-btn ${copiedId === tmp.id ? 'active' : ''}`, onClick: () => handleCopy(tmp.id, tmp.body), title: "Copy to clipboard", children: copiedId === tmp.id ? '✓' : '📋' }), _jsx("button", { className: "action-icon-btn danger", onClick: () => handleDeleteTemplate(tmp.id), title: "Delete", children: "\uD83D\uDDD1\uFE0F" })] })] }), _jsx("p", { className: "template-card-body", children: tmp.body }), _jsxs("div", { className: "template-card-footer", children: [_jsx("span", { className: "template-tag", children: tmp.tone }), _jsx("span", { className: "template-date", children: new Date(tmp.createdAt).toLocaleDateString() })] })] }, tmp.id)))) }))] })] }));
}
