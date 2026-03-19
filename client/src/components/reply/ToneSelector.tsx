import React from 'react';
import { ToneType } from '../../types';
import { Input } from '../ui/Input';

interface ToneSelectorProps {
    tone: ToneType;
    setTone: (tone: ToneType) => void;
    customTone: string;
    setCustomTone: (custom: string) => void;
    disabled?: boolean;
}

const TONES: { id: ToneType; label: string; icon: string }[] = [
    { id: 'professional', label: 'Professional', icon: '💼' },
    { id: 'friendly', label: 'Friendly', icon: '👋' },
    { id: 'firm', label: 'Firm', icon: '🛑' },
    { id: 'apologetic', label: 'Apologetic', icon: '🙏' },
    { id: 'custom', label: 'Custom', icon: '✨' },
];

export function ToneSelector({ tone, setTone, customTone, setCustomTone, disabled }: ToneSelectorProps) {
    return (
        <div className="w-full mt-6">
            <label className="text-sm font-medium text-white mb-3 block">Pick a tone</label>
            <div className="flex flex-wrap gap-2 mb-3">
                {TONES.map(t => (
                    <button
                        key={t.id}
                        type="button"
                        disabled={disabled}
                        onClick={() => setTone(t.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${tone === t.id
                                ? 'bg-[var(--accent)] text-white border border-transparent shadow-lg shadow-[var(--accent)]/20'
                                : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-white border border-[var(--border)] hover:border-[var(--border-hover)]'
                            }`}
                    >
                        <span>{t.icon}</span> {t.label}
                    </button>
                ))}
            </div>

            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${tone === 'custom' ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                <Input
                    disabled={disabled}
                    value={customTone}
                    onChange={(e) => setCustomTone(e.target.value)}
                    maxLength={200}
                    placeholder="e.g. enthusiastic but respectful"
                    className="mt-2"
                />
            </div>
        </div>
    );
}
