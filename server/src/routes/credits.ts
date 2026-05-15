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
// NGN amounts in kobo (Squad uses kobo). USD amounts in cents (LemonSqueezy uses cents).
const PACKS: Record<string, { credits: number; ngnKobo: number; usdCents: number; name: string }> = {
    starter: { credits: 30,  ngnKobo: 150000, usdCents: 500,  name: 'Starter (30 credits)' },
    pro:     { credits: 100, ngnKobo: 350000, usdCents: 1200, name: 'Pro (100 credits)' },
    power:   { credits: 300, ngnKobo: 800000, usdCents: 2500, name: 'Power (300 credits)' },
};

const SQUAD_BASE = process.env.SQUAD_API_BASE || 'https://api-d.squadco.com';
const CLIENT_URL = process.env.CLIENT_URL || 'https://replyai.com.ng';

// ── Squad NGN checkout — transaction-init API (reusable, fresh URL per user) ─
router.post('/gtsquad-checkout', verifyFirebaseToken, async (req: any, res: any, next: any) => {
    try {
        const { packId } = req.body;
        const email: string = req.user!.email || '';
        const userId: string = req.user!.uid || '';
        const pack = PACKS[packId as string];
        if (!pack)   return res.status(400).json({ message: 'Invalid pack' });
        if (!email)  return res.status(400).json({ message: 'No email on user' });

        const secretKey = process.env.GTSQUAD_SECRET_KEY || process.env.SQUAD_SECRET_KEY;
        if (!secretKey) {
            return res.status(500).json({ message: 'Squad not configured (missing GTSQUAD_SECRET_KEY)' });
        }

        const txRef = `replyai_${userId.slice(0, 10)}_${Date.now()}`;
        const r = await fetch(`${SQUAD_BASE}/transaction/initiate`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${secretKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount:        pack.ngnKobo,
                email,
                currency:      'NGN',
                initiate_type: 'inline',
                transaction_ref: txRef,
                callback_url:  `${CLIENT_URL}/dashboard?paid=1`,
                customer_name: req.user!.name || email,
                metadata: { pack: packId, userId, credits: pack.credits },
            }),
        });
        const j: any = await r.json().catch(() => ({}));
        const checkoutUrl = j?.data?.checkout_url;
        if (!r.ok || !checkoutUrl) {
            return res.status(502).json({ message: j?.message || 'Squad init failed' });
        }
        return res.json({ checkoutUrl, reference: txRef });
    } catch (err) { next(err); }
});

// ── LemonSqueezy USD checkout — pre-built variant URLs ───────────────────────
// Create products at app.lemonsqueezy.com → My Store → Products. Each PACK gets
// one product with one variant. Copy the "Buy now" URL (or the share URL) into
// the env vars below. We append ?checkout[email]=... so Lemon prefills email.
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
        if (!baseUrl) return res.status(500).json({ message: `LemonSqueezy URL not configured for pack=${packId}. Set LS_URL_${packId.toUpperCase()} in env.` });

        // Lemon Squeezy supports query-string prefill + custom data
        const url = new URL(baseUrl);
        if (email)  url.searchParams.set('checkout[email]', email);
        url.searchParams.set('checkout[custom][userId]', userId);
        url.searchParams.set('checkout[custom][pack]',   packId);
        return res.json({ checkoutUrl: url.toString() });
    } catch (err) { next(err); }
});

export default router;
