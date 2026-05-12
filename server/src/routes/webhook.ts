import { Router } from 'express';
import { verifyPaystackSignature } from '../services/paystackService.js';
import { verifyFlutterwaveSignature } from '../services/flutterwaveService.js';
import { addPaidCredits } from '../services/creditsService.js';
import { db } from '../db/index.js';
import { payments } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { logger } from '../utils/logger.js';
import https from 'https';
import crypto from 'crypto';

const router = Router();

// ─── Paystack webhook ────────────────────────────────────────────────────────
router.post('/paystack', async (req: any, res: any, next: any) => {
    try {
        const signature = req.headers['x-paystack-signature'] as string;
        const isValid = verifyPaystackSignature(req.body.toString(), signature);
        if (!isValid) {
            logger.warn('Invalid Paystack webhook signature');
            return res.status(401).send('Invalid signature');
        }
        const event = JSON.parse(req.body.toString());
        if (event.event === 'charge.success') {
            const reference = event.data.reference;
            const [payment] = await db.select().from(payments).where(eq(payments.paystackRef, reference));
            if (!payment) return res.status(200).send('Payment not found, ignoring');
            if (payment.status === 'success') return res.status(200).send('Already processed');
            await addPaidCredits(payment.userId!, payment.credits!, reference, payment.pack!, payment.amount!);
            logger.info(`Successfully added ${payment.credits} credits for user ${payment.userId}`);
        }
        return res.status(200).send('OK');
    } catch (err) {
        logger.error('Webhook error', err);
        return res.status(500).send('Webhook server error');
    }
});

// ─── Flutterwave direct webhook ──────────────────────────────────────────────
router.post('/flutterwave', async (req: any, res: any) => {
    try {
        const signature = req.headers['verif-hash'] as string;
        const isValid = verifyFlutterwaveSignature(JSON.stringify(req.body), signature);
        if (!isValid) {
            logger.warn('Invalid Flutterwave webhook signature');
            return res.status(401).send('Invalid signature');
        }
        const { event, data } = req.body;
        if (event === 'charge.completed' && data.status === 'successful') {
            const reference = data.tx_ref;
            const [payment] = await db.select().from(payments).where(eq(payments.paystackRef, reference));
            if (!payment) return res.status(200).send('Payment not found');
            if (payment.status === 'success') return res.status(200).send('Already processed');
            await addPaidCredits(payment.userId!, payment.credits!, reference, payment.pack!, payment.amount!);
            logger.info(`Flutterwave: Added ${payment.credits} credits for user ${payment.userId}`);
        }
        return res.status(200).send('OK');
    } catch (err) {
        logger.error('Flutterwave Webhook error', err);
        return res.status(500).send('Internal error');
    }
});

// ─── GTSquad webhook ─────────────────────────────────────────────────────────
// GTSquad signs every POST with HMAC-SHA256(secret_key, raw_body).
// Signature is sent in the X-GTSquad-Signature header as hex.
router.post('/gtsquad', async (req: any, res: any) => {
    try {
        const secret = process.env.GTSQUAD_SECRET_KEY || '';
        const rawBody = JSON.stringify(req.body);
        const expected = crypto
            .createHmac('sha256', secret)
            .update(rawBody)
            .digest('hex');
        const received = (req.headers['x-gtsquad-signature'] || '') as string;
        if (!secret || received !== expected) {
            logger.warn('GTSquad: Invalid webhook signature');
            return res.status(401).send('Invalid signature');
        }

        const { event, data } = req.body;
        if (event === 'payment.completed' && data?.status === 'success') {
            const reference = data.reference;
            const packId    = data.metadata?.packId as string | undefined;
            const email     = data.customer?.email as string | undefined;

            if (!reference || !packId || !email) {
                logger.warn('GTSquad: Missing reference/packId/email in payload', data);
                return res.status(200).send('OK');
            }

            // Find the user by email
            const { users } = await import('../db/schema.js');
            const { eq: eqD } = await import('drizzle-orm');
            const [user] = await db.select().from(users).where(eqD(users.email, email));
            if (!user) {
                logger.warn(`GTSquad: No user found for email ${email}`);
                return res.status(200).send('OK');
            }

            const PACK_CREDITS: Record<string, number> = { starter: 100, pro: 300, power: 1000 };
            const credits = PACK_CREDITS[packId] ?? 100;

            await addPaidCredits(user.id, credits, reference, packId, data.amount ?? 0);
            logger.info(`GTSquad: Added ${credits} credits to ${email}`);
        }

        return res.status(200).send('OK');
    } catch (err) {
        logger.error('GTSquad Webhook error', err);
        return res.status(500).send('Internal error');
    }
});

// ─── Monnify webhook ─────────────────────────────────────────────────────────
// Monnify signs with HMAC-SHA512(secret_key, raw_body).
// Header: monnify-signature
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

            // Derive pack from amount (NGN pricing buckets)
            const AMOUNT_TO_PACK: Array<{ min: number; pack: string; credits: number }> = [
                { min: 15000, pack: 'power',   credits: 1000 },
                { min: 5000,  pack: 'pro',     credits: 300  },
                { min: 0,     pack: 'starter', credits: 100  },
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

// ─── Flutterwave relay ───────────────────────────────────────────────────────
// Fans out to both ReplyAI + HarvestAI backends.
// Set in Flutterwave dashboard: https://api.replyai.com.ng/api/webhook/relay
router.post('/relay', async (req: any, res: any) => {
    const signature = req.headers['verif-hash'] as string;
    const secret = process.env.FLW_SECRET_HASH || '';
    if (!signature || signature !== secret) {
        logger.warn('Relay: Invalid Flutterwave verif-hash');
        return res.status(401).send('Invalid signature');
    }
    res.status(200).send('OK');

    const rawBody = JSON.stringify(req.body);
    const targets = ['api.replyai.com.ng', 'api.harvestai.com.ng'];

    const forwardTo = (host: string) => new Promise<void>((resolve) => {
        const options = {
            hostname: host, port: 443,
            path: '/api/webhook/flutterwave',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(rawBody),
                'verif-hash': secret,
            },
        };
        const reqOut = https.request(options, (resIn) => {
            resIn.resume();
            logger.info(`Relay → ${host}: ${resIn.statusCode}`);
            resolve();
        });
        reqOut.on('error', (e) => { logger.error(`Relay → ${host} error: ${e.message}`); resolve(); });
        reqOut.write(rawBody);
        reqOut.end();
    });
    Promise.all(targets.map(forwardTo)).catch((e) => logger.error('Relay error', e));
});

export default router;
