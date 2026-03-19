import { Router } from 'express';
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js';
import { checkCredits as getCreditsStatus } from '../services/creditsService.js';
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
        const { pack } = req.body;
        const userId = req.user!.uid;

        let amount = 0;
        let credits = 0;

        if (pack === 'starter') {
            amount = 150000; // 1500 NGN in kobo
            credits = 30;
        } else if (pack === 'pro') {
            amount = 350000;
            credits = 100;
        } else if (pack === 'power') {
            amount = 800000;
            credits = 300;
        } else {
            return res.status(400).json({ error: 'INVALID_PACK', message: 'Invalid pack type selected.' });
        }

        const reference = uuidv4();

        await db.insert(payments).values({
            userId,
            paystackRef: reference,
            amount,
            credits,
            status: 'pending',
            pack,
        });

        return res.json({
            reference,
            amount,
            email: req.user!.email // Need email for Paystack popup
        });
    } catch (err) {
        next(err);
    }
});

export default router;
