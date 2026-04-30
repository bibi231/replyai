import { Router } from 'express';
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

// Get settings
router.get('/settings', verifyFirebaseToken, async (req: any, res: any, next: any) => {
    try {
        const uid = req.user!.uid;
        const [user] = await db.select().from(users).where(eq(users.id, uid));
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            defaultTone: user.defaultTone,
            defaultLanguage: user.defaultLanguage,
            showTips: user.showTips === 1
        });
    } catch (err) {
        next(err);
    }
});

// Update settings
router.post('/settings', verifyFirebaseToken, async (req: any, res: any, next: any) => {
    try {
        const uid = req.user!.uid;
        const { defaultTone, defaultLanguage, showTips } = req.body;

        await db.update(users).set({
            defaultTone,
            defaultLanguage,
            showTips: showTips ? 1 : 0,
            updatedAt: new Date()
        }).where(eq(users.id, uid));

        res.json({ success: true });
    } catch (err) {
        next(err);
    }
});

export default router;
