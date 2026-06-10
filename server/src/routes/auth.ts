import { Router } from 'express';
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js';
import { upsertUser, checkCredits } from '../services/creditsService.js';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { sendWelcomeEmail } from '../lib/email/send.js';

const router = Router();

router.post('/sync', verifyFirebaseToken, async (req: any, res: any, next: any) => {
    try {
        const { displayName, photoUrl } = req.body;
        const uid = req.user!.uid;
        const email = req.user!.email!;

        // Detect new user before upsert so we can fire welcome email
        const [existingUser] = await db.select({ id: users.id }).from(users).where(eq(users.id, uid)).limit(1);
        const isNew = !existingUser;

        await upsertUser(uid, email, displayName, photoUrl);

        // Fetch the updated user and credits
        const [user] = await db.select().from(users).where(eq(users.id, uid));
        const creditsStatus = await checkCredits(uid);

        if (isNew && email) {
          sendWelcomeEmail(uid, email, displayName, 'https://replyai.com.ng').catch(console.error);
        }

        return res.json({
            user,
            credits: creditsStatus
        });
    } catch (err) {
        next(err);
    }
});

export default router;
