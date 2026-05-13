import { Router } from 'express';
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js';
import { checkCredits as getCreditsStatus, addPaidCredits } from '../services/creditsService.js';
import { eq } from 'drizzle-orm';
import { payments } from '../db/schema.js';
import { db } from '../db/index.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.get('/', verifyFirebaseToken, async (req: any, res: any, next: any) => {
    try {
        const userId = req.user!.uid;
        const status = await getCreditsStatus(userId);
        return res.json(status);
    } catch (err) {
        next(err);
    }
});

router.post('/initiate-purchase', verifyFirebaseToken, async (req: any, res: any, next: any) => {
    try {
        const { pack, currency = 'NGN', gateway = 'paystack' } = req.body;
        const userId = req.user!.uid;

        let amount = 0;
        let credits = 0;

        if (currency === 'NGN') {
            if (pack === 'starter') {
                amount = 150000; // 1500 NGN in kobo
                credits = 30;
            } else if (pack === 'pro') {
                amount = 350000;
                credits = 100;
            } else if (pack === 'power') {
                amount = 800000;
                credits = 300;
            }
        } else if (currency === 'USD') {
            if (pack === 'starter') {
                amount = 500; // $5.00 in cents
                credits = 30;
            } else if (pack === 'pro') {
                amount = 1200; // $12.00
                credits = 100;
            } else if (pack === 'power') {
                amount = 2500; // $25.00
                credits = 300;
            }
        }

        if (amount === 0) {
            return res.status(400).json({ error: 'INVALID_PACK', message: 'Invalid pack or currency selected.' });
        }

        const reference = uuidv4();

        await db.insert(payments).values({
            userId,
            paystackRef: reference,
            amount,
            currency,
            gateway,
            credits,
            status: 'pending',
            pack,
        });

        return res.json({
            reference,
            amount,
            currency,
            email: req.user!.email,
            publicKey: gateway === 'flutterwave' ? process.env.FLW_PUBLIC_KEY : process.env.PAYSTACK_PUBLIC_KEY
        });
    } catch (err) {
        next(err);
    }
});

router.post('/verify', verifyFirebaseToken, async (req: any, res: any, next: any) => {
    try {
        const userId = req.user!.uid;
        const { reference, tx_ref } = req.body;
        const ref = reference || tx_ref;
        if (!ref) return res.status(400).json({ error: 'Missing reference' });

        // Find the pending payment to get credits amount
        const [payment] = await db.select().from(payments).where(eq(payments.paystackRef, ref));
        if (!payment) return res.status(404).json({ error: 'Payment not found' });

        await addPaidCredits(userId, payment.credits, ref, payment.pack || 'unknown', payment.amount);
        const credits = await getCreditsStatus(userId);
        return res.json({ success: true, credits });
    } catch (err) {
        next(err);
    }
});

// ── Squad (GTSquad) checkout — returns a hosted payment link ─────────────────
const SQUAD_LINKS_REPLYAI: Record<string, string> = {
    starter: 'https://pay.squadco.com/link/ZYG21V',
    pro:     'https://pay.squadco.com/link/EDV8LC',
    power:   'https://pay.squadco.com/link/N7ZHGQ',
};

router.post('/gtsquad-checkout', verifyFirebaseToken, async (req: any, res: any, next: any) => {
    try {
        const { packId } = req.body;
        const email: string = req.user!.email || '';
        const baseUrl = SQUAD_LINKS_REPLYAI[packId as string];
        if (!baseUrl) return res.status(400).json({ message: 'Invalid pack' });
        const checkoutUrl = email ? `${baseUrl}?email=${encodeURIComponent(email)}` : baseUrl;
        return res.json({ checkoutUrl });
    } catch (err) {
        next(err);
    }
});

// ── Monnify checkout — uses Squad NGN links as fallback until Monnify KYC approved ──
const MONNIFY_LINKS_REPLYAI: Record<string, string> = {
    starter: 'https://pay.squadco.com/link/ZYG21V',
    pro:     'https://pay.squadco.com/link/EDV8LC',
    power:   'https://pay.squadco.com/link/N7ZHGQ',
};

router.post('/monnify-checkout', verifyFirebaseToken, async (req: any, res: any, next: any) => {
    try {
        const { packId } = req.body;
        const email: string = req.user!.email || '';
        const baseUrl = MONNIFY_LINKS_REPLYAI[packId as string];
        if (!baseUrl) return res.status(400).json({ message: 'Invalid pack' });
        const checkoutUrl = email ? `${baseUrl}?customerEmail=${encodeURIComponent(email)}` : baseUrl;
        return res.json({ checkoutUrl });
    } catch (err) {
        next(err);
    }
});

// ── Lemon Squeezy checkout — USD hosted checkout links ────────────────────────
// TODO: replace UUIDs with real product variant IDs from app.lemonsqueezy.com/products
const LEMON_LINKS_REPLYAI: Record<string, string> = {
    starter: 'https://replyai.lemonsqueezy.com/checkout/buy/STARTER_UUID',
    pro:     'https://replyai.lemonsqueezy.com/checkout/buy/PRO_UUID',
    power:   'https://replyai.lemonsqueezy.com/checkout/buy/POWER_UUID',
};

router.post('/lemonsqueezy-checkout', verifyFirebaseToken, async (req: any, res: any, next: any) => {
    try {
        const { packId } = req.body;
        const email: string = req.user!.email || '';
        const baseUrl = LEMON_LINKS_REPLYAI[packId as string];
        if (!baseUrl || baseUrl.includes('_UUID')) {
            return res.status(503).json({ message: 'Lemon Squeezy checkout not yet configured. Please use GTSquad or Monnify.' });
        }
        const url = new URL(baseUrl);
        if (email) url.searchParams.set('checkout[email]', email);
        return res.json({ checkoutUrl: url.toString() });
    } catch (err) {
        next(err);
    }
});

export default router;
