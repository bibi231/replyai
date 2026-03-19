import React, { useEffect, useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { api } from '../lib/api';
import { Spinner } from '../components/ui/Spinner';
import { Badge } from '../components/ui/Badge';

interface GenerationRecord {
    id: string;
    emailSnippet: string;
    tone: string;
    creditType: string;
    createdAt: string;
}

export function Dashboard() {
    const [history, setHistory] = useState<GenerationRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchHistory() {
            try {
                const res = await api.get('/api/reply/history');
                setHistory(res.data);
            } catch (err) {
                setError('Failed to load history');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchHistory();
    }, []);

    return (
        <PageWrapper>
            <div className="max-w-5xl mx-auto w-full">
                <h1 className="text-3xl font-display text-white mb-2">Usage History</h1>
                <p className="text-[var(--text-secondary)] mb-8">Your 20 most recent generations.</p>

                {isLoading ? (
                    <div className="flex justify-center p-12">
                        <Spinner size="lg" className="text-[var(--accent)]" />
                    </div>
                ) : error ? (
                    <div className="p-4 bg-[var(--error)]/10 text-[var(--error)] border border-[var(--error)]/20 rounded-[var(--radius)]">
                        {error}
                    </div>
                ) : history.length === 0 ? (
                    <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl p-12 text-center">
                        <p className="text-[var(--text-secondary)]">No generations yet.</p>
                    </div>
                ) : (
                    <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-[var(--bg-surface)] text-[var(--text-secondary)] border-b border-[var(--border)]">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Date</th>
                                        <th className="px-6 py-4 font-medium">Email Snippet</th>
                                        <th className="px-6 py-4 font-medium">Tone</th>
                                        <th className="px-6 py-4 font-medium">Credit</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border)]">
                                    {history.map((record) => (
                                        <tr key={record.id} className="hover:bg-[var(--bg-surface)]/50 transition-colors">
                                            <td className="px-6 py-4 text-[var(--text-muted)] whitespace-nowrap">
                                                {new Date(record.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-[var(--text-primary)] max-w-xs truncate">
                                                {record.emailSnippet || 'No snippet'}
                                            </td>
                                            <td className="px-6 py-4 capitalize">
                                                {record.tone}
                                            </td>
                                            <td className="px-6 py-4">
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
                )}
            </div>
        </PageWrapper>
    );
}
