import React from 'react';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/authStore';

interface GenerateButtonProps {
    onClick: () => void;
    disabled: boolean;
    isLoading: boolean;
}

export function GenerateButton({ onClick, disabled, isLoading }: GenerateButtonProps) {
    const credits = useAuthStore(s => s.credits);
    const hasCredits = credits ? credits.canGenerate : false;

    return (
        <div className="w-full mt-6">
            <Button
                size="lg"
                className="w-full font-bold text-base shadow-lg shadow-[var(--accent)]/10 py-4"
                onClick={onClick}
                disabled={disabled || !hasCredits}
                isLoading={isLoading}
            >
                {isLoading ? 'Generating...' : 'Generate 3 replies →'}
            </Button>
            {hasCredits && (
                <p className="text-center text-xs text-[var(--text-secondary)] mt-3">
                    Uses 1 credit
                </p>
            )}
            {!hasCredits && credits && (
                <p className="text-center text-xs text-[var(--error)] mt-3">
                    You need credits to generate
                </p>
            )}
        </div>
    );
}
