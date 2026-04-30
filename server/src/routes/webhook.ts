import { Router } from 'express';
import { verifyPaystackSignature } from '../services/paystackService.js';
import { verifyFlutterwaveSignature } from '../services/flutterwaveService.js';
import { addPaidCredits } from '../services/creditsService.js';
import { db } from '../db/index.js';
import { payments } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { logger } from '../utils/logger.js';

const router = Router();

router.post('/paystack', async (req: any, res: any, next: any) => {
    try {
        const signature = req.headers['x-paystack-signature'] as string;

        // Validate signature
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

export default router;
