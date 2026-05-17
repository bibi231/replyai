import { Router } from 'express';
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js';
import { checkCredits as getCreditsStatus } from '../services/creditsService.js';

const router = Router();

router.get('/', verifyFirebaseToken, async (req: any, res: any, next: any) => {
    try {
        const userId = req.user!.uid;
        const status = await getCreditsStatus(userId);
        return res.json(status);
    } catch (err) { next(err); }
});

// ── Pack catalog ────────────────────────────────────────────────────────────
// NGN in kobo, USD in cents. Squad supports both currencies.
const PACKS: Record<string, { credits: number; ngnKobo: number; usdCents: number; name: string }> = {
    starter: { credits: 30,  ngnKobo: 150000, usdCents: 500,  name: 'Starter' },
    pro:     { credits: 100, ngnKobo: 350000, usdCents: 1200, name: 'Pro' },
    power:   { credits: 300, ngnKobo: 800000, usdCents: 2500, name: 'Power' },
};

// ── Squad checkout — Server-side API Initiation ─────────────────────────────────
// Generates a checkoutUrl via Squad API which the client will redirect to.
router.post('/gtsquad-checkout', verifyFirebaseToken, async (req: any, res: any, next: any) => {
    try {
        const { packId, currency = 'NGN' } = req.body;
        const email: string = req.user!.email || '';
        const userId: string = req.user!.uid || '';
        const pack = PACKS[packId as string];
        if (!pack)  return res.status(400).json({ message: 'Invalid pack' });
        if (!email) return res.status(400).json({ message: 'No email on user' });

        const secretKey = process.env.GTSQUAD_SECRET_KEY || process.env.SQUAD_SECRET_KEY;
        if (!secretKey) return res.status(500).json({ message: 'Squad not configured (set GTSQUAD_SECRET_KEY)' });

        const cur = String(currency).toUpperCase() === 'USD' ? 'USD' : 'NGN';
        const amount = cur === 'USD' ? pack.usdCents : pack.ngnKobo;
        const txRef = `replyai_${userId.slice(0, 10)}_${Date.now()}`;
        const callbackUrl = 'https://replyai.com.ng';

        // Import axios dynamically if needed, or rely on top level import if it exists. 
        // We'll require it since this file doesn't have it imported.
        const axios = (await import('axios')).default;

        const response = await axios.post(
            'https://api-d.squadco.com/transaction/initiate',
            {
                email,
                amount,
                initiate_type: 'inline',
                currency: cur,
                callback_url: callbackUrl,
                transaction_ref: txRef,
                metadata: { pack: packId, userId, credits: pack.credits }
            },
            {
                headers: { 'Authorization': `Bearer ${secretKey}` }
            }
        );

        if (response.data && response.data.data && response.data.data.checkout_url) {
            return res.json({
                mode: 'redirect',
                checkoutUrl: response.data.data.checkout_url
            });
        }

        return res.status(502).json({ message: 'Failed to generate Squad payment link' });
    } catch (err: any) { 
        console.error('Squad Error:', err?.response?.data || err?.message);
        next(err); 
    }
});

// ── LemonSqueezy USD checkout — pre-built variant URLs from env ──────────────
// LS_URL_STARTER / LS_URL_PRO / LS_URL_POWER point to overlay-enabled buy URLs.
const LS_URLS: Record<string, string | undefined> = {
    starter: process.env.LS_URL_STARTER,
    pro:     process.env.LS_URL_PRO,
    power:   process.env.LS_URL_POWER,
};

router.post('/lemonsqueezy-checkout', verifyFirebaseToken, async (req: any, res: any, next: any) => {
    try {
        const { packId } = req.body;
        const email: string = req.user!.email || '';
        const userId: string = req.user!.uid || '';
        const pack = PACKS[packId as string];
        const baseUrl = LS_URLS[packId as string];
        if (!pack)    return res.status(400).json({ message: 'Invalid pack' });
        if (!baseUrl) return res.status(503).json({ message: `LemonSqueezy URL not configured (set LS_URL_${packId.toUpperCase()})` });

        const url = new URL(baseUrl);
        if (email)  url.searchParams.set('checkout[email]', email);
        url.searchParams.set('checkout[custom][userId]', userId);
        url.searchParams.set('checkout[custom][pack]',   packId);
        return res.json({ mode: 'overlay', checkoutUrl: url.toString() });
    } catch (err) { next(err); }
});

export default router;
