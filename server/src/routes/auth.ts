import { Router } from 'express';
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js';
import { upsertUser, checkCredits } from '../services/creditsService.js';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

router.post('/sync', verifyFirebaseToken, async (req: any, res: any, next: any) => {
    try {
        const { displayName, photoUrl } = req.body;
        const uid = req.user!.uid;
        const email = req.user!.email!;

        // Upsert the user
        await upsertUser(uid, email, displayName, photoUrl);

        // Fetch the updated user and credits
        const [user] = await db.select().from(users).where(eq(users.id, uid));
        const creditsStatus = await checkCredits(uid);

        return res.json({
            user,
            credits: creditsStatus
        });
    } catch (err) {
        next(err);
    }
});

export default router;
