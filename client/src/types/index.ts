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

// ── Meeting Types ────────────────────────────────────────
export interface ActionItem {
    id: string;
    text: string;
    assignee: string;
    dueDate?: string;
    status: 'pending' | 'in_progress' | 'done';
    priority: 'low' | 'medium' | 'high';
}

export interface Meeting {
    id: string;
    userId: string;
    title: string;
    date: string;
    rawNotes: string;
    summary?: string | null;
    actionItems: ActionItem[];
    tags: string[];
    status: 'draft' | 'processed';
    createdAt: string;
    updatedAt: string;
}

export interface MeetingStats {
    totalMeetings: number;
    totalActionItems: number;
    completedItems: number;
    pendingItems: number;
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

// ── Geo helpers ───────────────────────────────────────
const AFRICAN_TIMEZONES = [
    'Africa/Lagos', 'Africa/Abidjan', 'Africa/Accra',
    'Africa/Addis_Ababa', 'Africa/Algiers', 'Africa/Asmara',
    'Africa/Bamako', 'Africa/Bangui', 'Africa/Banjul',
    'Africa/Bissau', 'Africa/Blantyre', 'Africa/Brazzaville',
    'Africa/Bujumbura', 'Africa/Cairo', 'Africa/Casablanca',
    'Africa/Ceuta', 'Africa/Conakry', 'Africa/Dakar',
    'Africa/Dar_es_Salaam', 'Africa/Djibouti', 'Africa/Douala',
    'Africa/El_Aaiun', 'Africa/Freetown', 'Africa/Gaborone',
    'Africa/Harare', 'Africa/Johannesburg', 'Africa/Juba',
    'Africa/Kampala', 'Africa/Khartoum', 'Africa/Kigali',
    'Africa/Kinshasa', 'Africa/Libreville', 'Africa/Lome',
    'Africa/Luanda', 'Africa/Lubumbashi', 'Africa/Lusaka',
    'Africa/Malabo', 'Africa/Maputo', 'Africa/Maseru',
    'Africa/Mbabane', 'Africa/Mogadishu', 'Africa/Monrovia',
    'Africa/Nairobi', 'Africa/Ndjamena', 'Africa/Niamey',
    'Africa/Nouakchott', 'Africa/Ouagadougou',
    'Africa/Porto-Novo', 'Africa/Sao_Tome', 'Africa/Tripoli',
    'Africa/Tunis', 'Africa/Windhoek',
];

export function detectCurrency(): 'NGN' | 'USD' {
    try {
        const override = typeof window !== 'undefined'
            ? window.localStorage.getItem('replyai:currency')
            : null;
        if (override === 'NGN' || override === 'USD') return override;
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
        if (tz.startsWith('Africa/') || AFRICAN_TIMEZONES.includes(tz)) {
            return 'NGN';
        }
        return 'USD';
    } catch {
        return 'USD';
    }
}
