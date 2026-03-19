export type ToneType = 'professional' | 'friendly' | 'firm' | 'apologetic' | 'custom';

export interface ReplyDraft {
    id: string;
    label: string;
    subject: string;
    body: string;
    wordCount: number;
}

export type PackType = 'starter' | 'pro' | 'power';

export interface CreditPack {
    id: PackType;
    name: string;
    price: number;
    credits: number;
    pricePerReply: string;
    popular?: boolean;
}

export const CREDIT_PACKS: CreditPack[] = [
    { id: 'starter', name: 'Starter', price: 1500, credits: 30, pricePerReply: '₦50' },
    { id: 'pro', name: 'Pro', price: 3500, credits: 100, pricePerReply: '₦35', popular: true },
    { id: 'power', name: 'Power', price: 8000, credits: 300, pricePerReply: '₦27' },
];
