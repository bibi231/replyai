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
    price: number;        // NGN price (currency unit, not minor)
    priceUSD: number;     // USD price (currency unit, decimals OK)
    credits: number;
    pricePerReply: string;
    pricePerReplyUSD: string;
    popular?: boolean;
}

/**
 * NGN: localised pricing for Nigerian users (Paystack)
 * USD: still well below US-market norms but priced for sustainable global revenue (Flutterwave)
 *      e.g. Starter 30 credits → $5 (~₦7,500 effective) vs ₦1,500 local
 */
export const CREDIT_PACKS: CreditPack[] = [
    {
        id: 'starter',
        name: 'Starter',
        price: 1500,
        priceUSD: 5,
        credits: 30,
        pricePerReply: '₦50',
        pricePerReplyUSD: '$0.17',
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 3500,
        priceUSD: 12,
        credits: 100,
        pricePerReply: '₦35',
        pricePerReplyUSD: '$0.12',
        popular: true,
    },
    {
        id: 'power',
        name: 'Power',
        price: 8000,
        priceUSD: 25,
        credits: 300,
        pricePerReply: '₦27',
        pricePerReplyUSD: '$0.08',
    },
];

// ── Geo helpers ───────────────────────────────────────────
const AFRICAN_TIMEZONES = [
    'Africa/Lagos', 'Africa/Abidjan', 'Africa/Accra', 'Africa/Addis_Ababa',
    'Africa/Algiers', 'Africa/Asmara', 'Africa/Bamako', 'Africa/Bangui',
    'Africa/Banjul', 'Africa/Bissau', 'Africa/Blantyre', 'Africa/Brazzaville',
    'Africa/Bujumbura', 'Africa/Cairo', 'Africa/Casablanca', 'Africa/Ceuta',
    'Africa/Conakry', 'Africa/Dakar', 'Africa/Dar_es_Salaam', 'Africa/Djibouti',
    'Africa/Douala', 'Africa/El_Aaiun', 'Africa/Freetown', 'Africa/Gaborone',
    'Africa/Harare', 'Africa/Johannesburg', 'Africa/Juba', 'Africa/Kampala',
    'Africa/Khartoum', 'Africa/Kigali', 'Africa/Kinshasa', 'Africa/Lagos',
    'Africa/Libreville', 'Africa/Lome', 'Africa/Luanda', 'Africa/Lubumbashi',
    'Africa/Lusaka', 'Africa/Malabo', 'Africa/Maputo', 'Africa/Maseru',
    'Africa/Mbabane', 'Africa/Mogadishu', 'Africa/Monrovia', 'Africa/Nairobi',
    'Africa/Ndjamena', 'Africa/Niamey', 'Africa/Nouakchott', 'Africa/Ouagadougou',
    'Africa/Porto-Novo', 'Africa/Sao_Tome', 'Africa/Tripoli', 'Africa/Tunis',
    'Africa/Windhoek',
];

/**
 * Best-effort geo: returns 'NGN' for likely Africa-based users, else 'USD'.
 * Uses Intl timezone (works offline, no API call). Honours localStorage override.
 */
export function detectCurrency(): 'NGN' | 'USD' {
    try {
        const override = typeof window !== 'undefined' ? window.localStorage.getItem('replyai:currency') : null;
        if (override === 'NGN' || override === 'USD') return override;
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
        if (tz.startsWith('Africa/') || AFRICAN_TIMEZONES.includes(tz)) return 'NGN';
        return 'USD';
    } catch {
        return 'USD';
    }
}
