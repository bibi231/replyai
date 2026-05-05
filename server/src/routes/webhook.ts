import { Router } from 'express';
import { verifyPaystackSignature } from '../services/paystackService.js';
import { verifyFlutterwaveSignature } from '../services/flutterwaveService.js';
import { addPaidCredits } from '../services/creditsService.js';
import { db } from '../db/index.js';
import { payments } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { logger } from '../utils/logger.js';
import https from 'https';

const router = Router();

// ── Paystack webhook ─────────────────────────────────────────────────────────
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
            const data = event.data;
            const reference = data.reference;

            const [payment] = await db.select().from(payments).where(eq(payments.paystackRef, reference));

            if (!payment) {
                logger.error(`Payment not found for reference: ${reference}`);
                return res.status(200).send('Payment not found, ignoring');
            }

            if (payment.status === 'success') {
                return res.status(200).send('Already processed');
            }

            await addPaidCredits(payment.userId!, payment.credits!, reference, payment.pack!, payment.amount!);
            logger.info(`Successfully added ${payment.credits} credits for user ${payment.userId}`);
        }

        return res.status(200).send('OK');
    } catch (err) {
        logger.error('Webhook error', err);
        return res.status(500).send('Webhook server error');
    }
});

// ── Flutterwave direct webhook (ReplyAI only) ────────────────────────────────
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

            if (!payment) {
                logger.error(`Payment not found for Flutterwave ref: ${reference}`);
                return res.status(200).send('Payment not found');
            }

            if (payment.status === 'success') {
                return res.status(200).send('Already processed');
            }

            await addPaidCredits(payment.userId!, payment.credits!, reference, payment.pack!, payment.amount!);
            logger.info(`Flutterwave: Added ${payment.credits} credits for user ${payment.userId}`);
        }

        return res.status(200).send('OK');
    } catch (err) {
        logger.error('Flutterwave Webhook error', err);
        return res.status(500).send('Internal error');
    }
});

// ── Flutterwave RELAY ────────────────────────────────────────────────────────
// Single entry point → fans out to both ReplyAI + HarvestAI backends in parallel.
// Set this URL in Flutterwave dashboard:
//   https://api.replyai.com.ng/api/webhook/relay
router.post('/relay', async (req: any, res: any) => {
    // 1. Verify the shared secret immediately — reject bad requests early
    const signature = req.headers['verif-hash'] as string;
    const secret = process.env.FLW_SECRET_HASH || '';
    if (!signature || signature !== secret) {
        logger.warn('Relay: Invalid Flutterwave verif-hash');
        return res.status(401).send('Invalid signature');
    }

    // 2. Return 200 immediately so Flutterwave doesn't retry
    res.status(200).send('OK');

    // 3. Forward raw body to both backends (fire-and-forget)
    const rawBody = JSON.stringify(req.body);
    const targets = [
        'api.replyai.com.ng',
        'api.harvestai.com.ng',
    ];

    const forwardTo = (host: string) => new Promise<void>((resolve) => {
        const options = {
            hostname: host,
            port: 443,
            path: '/api/webhook/flutterwave',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(rawBody),
                'verif-hash': secret,
            },
        };
        const reqOut = https.request(options, (resIn) => {
            resIn.resume(); // drain
            logger.info(`Relay → ${host}: ${resIn.statusCode}`);
            resolve();
        });
        reqOut.on('error', (e) => {
            logger.error(`Relay → ${host} error: ${e.message}`);
            resolve();
        });
        reqOut.write(rawBody);
        reqOut.end();
    });

    // Run both forwards in parallel, don't await (already sent 200)
    Promise.all(targets.map(forwardTo)).catch((e) => {
        logger.error('Relay parallel forward error', e);
    });
});

export default router;
