import React, { useState, useEffect, useRef } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { EmailInput } from '../components/reply/EmailInput';
import { ToneSelector } from '../components/reply/ToneSelector';
import { GenerateButton } from '../components/reply/GenerateButton';
import { ReplyCard } from '../components/reply/ReplyCard';
import { Input } from '../components/ui/Input';
import { useReply } from '../hooks/useReply';
import { ToneType } from '../types';

export function AppPage() {
    const [emailContent, setEmailContent] = useState('');
    const [tone, setTone] = useState<ToneType>('professional');
    const [customTone, setCustomTone] = useState('');
    const [context, setContext] = useState('');
    const [isContextOpen, setIsContextOpen] = useState(false);

    const { replies, isGenerating, error, generate } = useReply();
    const outputRef = useRef<HTMLDivElement>(null);

    const handleGenerate = () => {
        let finalTone = tone;
        let actualCustomTone = customTone;

        if (tone === 'custom' && !customTone.trim()) {
            actualCustomTone = 'Professional';
        }

        generate(
            emailContent,
            finalTone,
            tone === 'custom' ? actualCustomTone : context
        );
    };

    useEffect(() => {
        if (replies.length > 0 && outputRef.current) {
            if (window.innerWidth < 1024) {
                outputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }, [replies]);

    return (
        <PageWrapper>
            <div className="flex flex-col lg:flex-row gap-8 h-full">
                {/* Left Column - Input */}
                <div className="w-full lg:w-1/2 flex flex-col h-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl p-6 shadow-lg">
                    <div className="flex-grow flex flex-col">
                        <EmailInput
                            value={emailContent}
                            onChange={setEmailContent}
                            disabled={isGenerating}
                        />

                        <ToneSelector
                            tone={tone}
                            setTone={setTone}
                            customTone={customTone}
                            setCustomTone={setCustomTone}
                            disabled={isGenerating}
                        />

                        <div className="mt-4">
                            <button
                                onClick={() => setIsContextOpen(!isContextOpen)}
                                className="text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors flex items-center gap-1"
                            >
                                {isContextOpen ? '− Hide context (optional)' : '+ Add context (optional)'}
                            </button>

                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isContextOpen ? 'max-h-24 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                                <Input
                                    value={context}
                                    onChange={(e) => setContext(e.target.value)}
                                    disabled={isGenerating}
                                    maxLength={300}
                                    placeholder="e.g. Reject the offer warmly, I'm too busy this week."
                                />
                            </div>
                        </div>

                        <div className="mt-auto">
                            {error && (
                                <div className="mt-4 p-3 bg-[var(--error)]/10 border border-[var(--error)]/20 text-[var(--error)] text-sm rounded-[var(--radius)]">
                                    {error}
                                </div>
                            )}
                            <GenerateButton
                                onClick={handleGenerate}
                                disabled={emailContent.trim().length === 0}
                                isLoading={isGenerating}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column - Output */}
                <div ref={outputRef} className="w-full lg:w-1/2 flex flex-col h-full">
                    {replies.length === 0 && !isGenerating ? (
                        <div className="flex-grow flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-[var(--border)] rounded-2xl bg-[var(--bg-elevated)]/30 min-h-[400px]">
                            <div className="w-16 h-16 rounded-full bg-[var(--bg-surface)] flex items-center justify-center mb-4 text-2xl border border-[var(--border)]">
                                ✨
                            </div>
                            <h3 className="text-lg font-medium text-white mb-2">Ready to write</h3>
                            <p className="text-[var(--text-secondary)] text-sm max-w-sm">
                                Your 3 reply drafts will appear here. Pick a tone and hit Generate.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {isGenerating ? (
                                // Skeleton loader
                                <div className="space-y-6">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="bg-[var(--bg-elevated)]/50 border border-[var(--border)] rounded-2xl p-6 animate-pulse min-h-[200px]">
                                            <div className="flex justify-between mb-4">
                                                <div className="w-24 h-5 bg-[var(--bg-surface)] rounded-full"></div>
                                                <div className="w-16 h-4 bg-[var(--bg-surface)] rounded"></div>
                                            </div>
                                            <div className="w-1/3 h-6 bg-[var(--bg-surface)] rounded mb-4 mt-2"></div>
                                            <div className="w-full h-4 bg-[var(--bg-surface)] rounded mb-2"></div>
                                            <div className="w-full h-4 bg-[var(--bg-surface)] rounded mb-2"></div>
                                            <div className="w-4/5 h-4 bg-[var(--bg-surface)] rounded"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                replies.map((draft, idx) => (
                                    <ReplyCard key={draft.id} draft={draft} index={idx} />
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </PageWrapper>
    );
}
