export type ToneType = 'professional' | 'friendly' | 'firm' | 'apologetic' | 'custom';
export type OutputLanguage = 'en' | 'pidgin' | 'yoruba' | 'hausa' | 'fr';

export const OUTPUT_LANGUAGES: Record<OutputLanguage, { label: string; icon: string }> = {
    en: { label: 'English', icon: '🇬🇧' },
    pidgin: { label: 'Pidgin', icon: '🇳🇬' },
    yoruba: { label: 'Yoruba', icon: '🇳🇬' },
    hausa: { label: 'Hausa', icon: '🇳🇬' },
    fr: { label: 'French', icon: '🇫🇷' },
};

export interface ReplyDraft {
    id: string;
    label: string;
    subject: string;
    body: string;
    wordCount: number;
}

export interface ReplyTemplate {
    id: string;
    title: string;
    body: string;
    tone?: string;
    category?: string;
    createdAt: string;
}

export type PackType = 'starter' | 'pro' | 'power';

export interface CreditPack {
    id: PackType;
    name: string;
    price: number;
    priceUSD: number;
    credits: number;
    pricePerReply: string;
    pricePerReplyUSD: string;
    popular?: boolean;
}

export const CREDIT_PACKS: CreditPack[] = [
    { id: 'starter', name: 'Starter', price: 1500, priceUSD: 1, credits: 30, pricePerReply: '₦50', pricePerReplyUSD: '$0.03' },
    { id: 'pro', name: 'Pro', price: 3500, priceUSD: 3, credits: 100, pricePerReply: '₦35', pricePerReplyUSD: '$0.03', popular: true },
    { id: 'power', name: 'Power', price: 8000, priceUSD: 10, credits: 300, pricePerReply: '₦27', pricePerReplyUSD: '$0.03' },
];
