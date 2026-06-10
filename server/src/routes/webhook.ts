import { Router } from 'express';
import { addPaidCredits } from '../services/creditsService.js';
import { db } from '../db/index.js';
import { logger } from '../utils/logger.js';
import crypto from 'crypto';
import { sendPaymentSuccessEmail } from '../lib/email/send.js';

const router = Router();

// ── GTSquad webhook ───────────────────────────────────────────────────────────
// Docs: https://docs.squadco.com — header is x-squad-encrypted-body,
// algorithm is HMAC-SHA512, hex output uppercased.
router.post('/gtsquad', async (req: any, res: any) => {
    try {
        const secret = process.env.GTSQUAD_SECRET_KEY || '';
        const rawBody = JSON.stringify(req.body);
        const expected = crypto
            .createHmac('sha512', secret)
            .update(rawBody)
            .digest('hex')
            .toUpperCase();
        const received = ((req.headers['x-squad-encrypted-body'] || '') as string).toUpperCase();

        if (!secret || received !== expected) {
            logger.warn('GTSquad: Invalid webhook signature');
            return res.status(401).send('Invalid signature');
        }

        const { Body: body } = req.body;
        // Squad wraps the payload in { Event, Body }
        const event = req.body.Event || req.body.event;
        const data = body || req.body.data || req.body;

        if (
            (event === 'charge_successful' || event === 'payment.completed') &&
            (data?.gateway_response === 'Successful' || data?.status === 'success' || data?.transaction_status === 'success')
        ) {
            const reference = data.transaction_ref || data.reference;
            // metadata sent from the inline widget: { pack: 'starter', userId: '...', credits: 30 }
            const meta = data.meta || data.metadata || {};
            const packId = meta.pack || meta.packId;
            const email = data.email || data.customer_email || data.customer?.email;

            if (!reference || !packId || !email) {
                logger.warn('GTSquad: Missing reference/packId/email in payload', data);
                return res.status(200).send('OK');
            }

            const { users } = await import('../db/schema.js');
            const { eq: eqD } = await import('drizzle-orm');
            const [user] = await db.select().from(users).where(eqD(users.email, email));
            if (!user) {
                logger.warn(`GTSquad: No user found for email ${email}`);
                return res.status(200).send('OK');
            }

            // ReplyAI packs: starter=30, pro=100, power=300
            const PACK_CREDITS: Record<string, number> = { starter: 30, pro: 100, power: 300 };
            const credits = PACK_CREDITS[packId] ?? 30;

            await addPaidCredits(user.id, credits, reference, packId, data.amount ?? 0);
            logger.info(`GTSquad: Added ${credits} credits to ${email} (pack=${packId})`);
            sendPaymentSuccessEmail(user.id, email, {
              credits,
              pack: packId,
              amountNgn: (data.amount ?? 0) * 100,
              txRef: reference,
            }).catch(console.error);
        }

        return res.status(200).send('OK');
    } catch (err) {
        logger.error('GTSquad Webhook error', err);
        return res.status(500).send('Internal error');
    }
});

// ── Monnify webhook ───────────────────────────────────────────────────────────
router.post('/monnify', async (req: any, res: any) => {
    try {
        const secret = process.env.MONNIFY_SECRET_KEY || '';
        const rawBody = JSON.stringify(req.body);
        const expected = crypto
            .createHmac('sha512', secret)
            .update(rawBody)
            .digest('hex');
        const received = (req.headers['monnify-signature'] || '') as string;
        if (!secret || received !== expected) {
            logger.warn('Monnify: Invalid webhook signature');
            return res.status(401).send('Invalid signature');
        }

        const { eventType, eventData } = req.body;
        logger.info(`Monnify event: ${eventType}`);

        if (eventType === 'SUCCESSFUL_TRANSACTION') {
            const reference  = eventData?.transactionReference as string;
            const email      = eventData?.customer?.email as string;
            const amountPaid = eventData?.amountPaid as number;

            if (!reference || !email) return res.status(200).send('OK');

            const { users } = await import('../db/schema.js');
            const { eq: eqD } = await import('drizzle-orm');
            const [user] = await db.select().from(users).where(eqD(users.email, email));
            if (!user) {
                logger.warn(`Monnify: No user found for ${email}`);
                return res.status(200).send('OK');
            }

            const AMOUNT_TO_PACK: Array<{ min: number; pack: string; credits: number }> = [
                { min: 15000, pack: 'power',   credits: 300  },
                { min: 5000,  pack: 'pro',     credits: 100  },
                { min: 0,     pack: 'starter', credits: 30   },
            ];
            const bucket = AMOUNT_TO_PACK.find(b => amountPaid >= b.min) ?? AMOUNT_TO_PACK[2];
            await addPaidCredits(user.id, bucket.credits, reference, bucket.pack, amountPaid);
            logger.info(`Monnify: Added ${bucket.credits} credits to ${email}`);
        }

        return res.status(200).send('OK');
    } catch (err) {
        logger.error('Monnify Webhook error', err);
        return res.status(500).send('Internal error');
    }
});

export default router;
