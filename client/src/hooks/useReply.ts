import { useState } from 'react';
import { ToneType, ReplyDraft, OutputLanguage } from '../types';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';

export function useReply() {
    const [replies, setReplies] = useState<ReplyDraft[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function generate(emailContent: string, tone: ToneType, context?: string, outputLanguage: OutputLanguage = 'en') {
        setIsGenerating(true);
        setError(null);
        try {
            const res = await api.post('/api/reply/generate', { emailContent, tone, context, outputLanguage });
            setReplies(res.data.replies);

            const cr = res.data.creditsRemaining;
            useAuthStore.setState((state) => ({
                credits: state.credits ? {
                    ...state.credits,
                    free: cr.free,
                    paid: cr.paid,
                    canGenerate: cr.free > 0 || cr.paid > 0
                } : null
            }));
        } catch (err: any) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setIsGenerating(false);
        }
    }

    function clearReplies() {
        setReplies([]);
    }

    return { replies, isGenerating, error, generate, clearReplies };
}
