import { Router } from 'express';
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js';
import { db } from '../db/index.js';
import { replyTemplates } from '../db/schema.js';
import { eq, desc, and } from 'drizzle-orm';

const router = Router();

// Get all templates for user
router.get('/', verifyFirebaseToken, async (req: any, res: any, next: any) => {
    try {
        const userId = req.user!.uid;
        const templates = await db.select()
            .from(replyTemplates)
            .where(eq(replyTemplates.userId, userId))
            .orderBy(desc(replyTemplates.createdAt));

        return res.json(templates);
    } catch (err) {
        next(err);
    }
});

// Create new template
router.post('/', verifyFirebaseToken, async (req: any, res: any, next: any) => {
    try {
        const userId = req.user!.uid;
        const { title, body, tone, category } = req.body;

        if (!title || !body) {
            return res.status(400).json({ error: 'INVALID_INPUT', message: 'Title and body are required.' });
        }

        const [newTemplate] = await db.insert(replyTemplates).values({
            userId,
            title,
            body,
            tone,
            category: category || 'general'
        }).returning();

        return res.json(newTemplate);
    } catch (err) {
        next(err);
    }
});

// Update template
router.patch('/:id', verifyFirebaseToken, async (req: any, res: any, next: any) => {
    try {
        const userId = req.user!.uid;
        const { id } = req.params;
        const { title, body, tone, category } = req.body;

        const [updatedTemplate] = await db.update(replyTemplates)
            .set({
                title,
                body,
                tone,
                category,
                updatedAt: new Date()
            })
            .where(and(eq(replyTemplates.id, id as any), eq(replyTemplates.userId, userId)))
            .returning();

        if (!updatedTemplate) {
            return res.status(404).json({ error: 'NOT_FOUND', message: 'Template not found or unauthorized.' });
        }

        return res.json(updatedTemplate);
    } catch (err) {
        next(err);
    }
});

// Delete template
router.delete('/:id', verifyFirebaseToken, async (req: any, res: any, next: any) => {
    try {
        const userId = req.user!.uid;
        const { id } = req.params;

        const [deletedTemplate] = await db.delete(replyTemplates)
            .where(and(eq(replyTemplates.id, id as any), eq(replyTemplates.userId, userId)))
            .returning();

        if (!deletedTemplate) {
            return res.status(404).json({ error: 'NOT_FOUND', message: 'Template not found or unauthorized.' });
        }

        return res.json({ success: true });
    } catch (err) {
        next(err);
    }
});

export default router;
