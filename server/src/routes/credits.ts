import { Router } from 'express';
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js';
import { checkCredits as getCreditsStatus, addPaidCredits } from '../services/creditsService.js';
import { db } from '../db/index.js';
import { payments } from '../db/schema.js';
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
                amount = 100; // $1.00 in cents
                credits = 30;
            } else if (pack === 'pro') {
                amount = 300; // $3.00
                credits = 100;
            } else if (pack === 'power') {
                amount = 1000; // $10.00
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
        const { eq } = await import('drizzle-orm');
        const { payments } = await import('../db/schema.js');
        const { db } = await import('../db/index.js');
        const [payment] = await db.select().from(payments).where(eq(payments.paystackRef, ref));
        if (!payment) return res.status(404).json({ error: 'Payment not found' });

        await addPaidCredits(userId, payment.credits, ref, payment.pack || 'unknown', payment.amount);
        const credits = await getCreditsStatus(userId);
        return res.json({ success: true, credits });
    } catch (err) {
        next(err);
    }
});

export default router;
