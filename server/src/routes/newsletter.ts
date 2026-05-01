import { Router } from 'express';
import { db } from '../db/index.js';
import { sql } from 'drizzle-orm';
import { logger } from '../utils/logger.js';

const router = Router();

/**
 * POST /api/newsletter/subscribe
 * Body: { email: string, source?: string }
 *
 * Stores subscriber in newsletter_subscribers table (auto-created on first call)
 * and (if RESEND_API_KEY is set) adds them to the configured Resend audience.
 */
router.post('/subscribe', async (req: any, res: any) => {
  try {
    const { email, source } = req.body || {};
    if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: 'INVALID_EMAIL', message: 'A valid email is required.' });
    }

    // Lazy create the table (idempotent) so we don't need a separate migration just for this
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id        SERIAL PRIMARY KEY,
        email     VARCHAR(255) NOT NULL UNIQUE,
        source    VARCHAR(64),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Insert; ignore duplicates so the user gets a friendly success either way
    await db.execute(sql`
      INSERT INTO newsletter_subscribers (email, source)
      VALUES (${email.toLowerCase().trim()}, ${source || 'unknown'})
      ON CONFLICT (email) DO NOTHING
    `);

    // Mirror to Resend audience if configured
    const resendKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (resendKey && audienceId) {
      try {
        await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email.toLowerCase().trim(), unsubscribed: false }),
        });
      } catch (e: any) {
        logger.warn(`Resend audience add failed: ${e?.message}`);
      }
    }

    return res.json({ ok: true });
  } catch (err: any) {
    logger.error('Newsletter subscribe error: ' + (err?.message || String(err)));
    return res.status(500).json({ error: 'INTERNAL', message: 'Could not subscribe. Try again.' });
  }
});

export default router;
