import { Router } from 'express';
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js';
import { checkCredits } from '../middleware/checkCredits.js';
import { generateRateLimit } from '../middleware/rateLimit.js';
import { summarizeMeeting, extractActionItems, AIAllModelsFailedError, AIParseError } from '../services/aiService.js';
import { deductCredit } from '../services/creditsService.js';
import { db } from '../db/index.js';
import { meetings } from '../db/schema.js';
import { desc, eq, and } from 'drizzle-orm';
import { randomUUID } from 'crypto';

const router = Router();

// GET /api/meetings — list all meetings for user
router.get('/', verifyFirebaseToken, async (req: any, res: any) => {
    try {
        const userId = req.user!.uid;
        const rows = await db.select().from(meetings)
            .where(eq(meetings.userId, userId))
            .orderBy(desc(meetings.date));
        return res.json({ meetings: rows });
    } catch (err: any) {
        return res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
    }
});

// GET /api/meetings/:id — get single meeting
router.get('/:id', verifyFirebaseToken, async (req: any, res: any) => {
    try {
        const userId = req.user!.uid;
        const [meeting] = await db.select().from(meetings)
            .where(and(eq(meetings.id, req.params.id), eq(meetings.userId, userId)));
        if (!meeting) return res.status(404).json({ error: 'NOT_FOUND', message: 'Meeting not found' });
        return res.json({ meeting });
    } catch (err: any) {
        return res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
    }
});

// POST /api/meetings — create meeting
router.post('/', verifyFirebaseToken, async (req: any, res: any) => {
    try {
        const userId = req.user!.uid;
        const { title, date, rawNotes, tags } = req.body;

        if (!title || typeof title !== 'string' || title.length > 500) {
            return res.status(400).json({ error: 'INVALID_INPUT', message: 'title is required (max 500 chars)' });
        }
        if (!rawNotes || typeof rawNotes !== 'string') {
            return res.status(400).json({ error: 'INVALID_INPUT', message: 'rawNotes is required' });
        }

        const [meeting] = await db.insert(meetings).values({
            userId,
            title,
            date: date ? new Date(date) : new Date(),
            rawNotes,
            tags: tags || [],
            status: 'draft',
        }).returning();

        return res.status(201).json({ meeting });
    } catch (err: any) {
        return res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
    }
});

// PUT /api/meetings/:id — update meeting
router.put('/:id', verifyFirebaseToken, async (req: any, res: any) => {
    try {
        const userId = req.user!.uid;
        const { title, date, rawNotes, tags, actionItems } = req.body;

        const updates: any = { updatedAt: new Date() };
        if (title !== undefined) updates.title = title;
        if (date !== undefined) updates.date = new Date(date);
        if (rawNotes !== undefined) updates.rawNotes = rawNotes;
        if (tags !== undefined) updates.tags = tags;
        if (actionItems !== undefined) updates.actionItems = actionItems;

        const [meeting] = await db.update(meetings)
            .set(updates)
            .where(and(eq(meetings.id, req.params.id), eq(meetings.userId, userId)))
            .returning();

        if (!meeting) return res.status(404).json({ error: 'NOT_FOUND', message: 'Meeting not found' });
        return res.json({ meeting });
    } catch (err: any) {
        return res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
    }
});

// DELETE /api/meetings/:id
router.delete('/:id', verifyFirebaseToken, async (req: any, res: any) => {
    try {
        const userId = req.user!.uid;
        const [deleted] = await db.delete(meetings)
            .where(and(eq(meetings.id, req.params.id), eq(meetings.userId, userId)))
            .returning();
        if (!deleted) return res.status(404).json({ error: 'NOT_FOUND', message: 'Meeting not found' });
        return res.json({ success: true });
    } catch (err: any) {
        return res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
    }
});

// POST /api/meetings/:id/summarize — AI summarize (costs 1 credit)
router.post('/:id/summarize', verifyFirebaseToken, checkCredits, generateRateLimit, async (req: any, res: any) => {
    try {
        const userId = req.user!.uid;
        const [meeting] = await db.select().from(meetings)
            .where(and(eq(meetings.id, req.params.id), eq(meetings.userId, userId)));
        if (!meeting) return res.status(404).json({ error: 'NOT_FOUND', message: 'Meeting not found' });
        if (!meeting.rawNotes || meeting.rawNotes.trim().length < 20) {
            return res.status(400).json({ error: 'INVALID_INPUT', message: 'Meeting notes are too short to summarize' });
        }

        const summary = await summarizeMeeting(meeting.rawNotes);
        const creditResult = await deductCredit(userId);

        const [updated] = await db.update(meetings)
            .set({ summary, status: 'processed', updatedAt: new Date() })
            .where(eq(meetings.id, req.params.id))
            .returning();

        return res.json({
            meeting: updated,
            creditsRemaining: { free: creditResult.freeRemaining, paid: creditResult.paidCredits },
            creditUsed: creditResult.creditType,
        });
    } catch (err: any) {
        if (err instanceof AIAllModelsFailedError || err instanceof AIParseError) throw err;
        return res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
    }
});

// POST /api/meetings/:id/extract — AI extract action items (costs 1 credit)
router.post('/:id/extract', verifyFirebaseToken, checkCredits, generateRateLimit, async (req: any, res: any) => {
    try {
        const userId = req.user!.uid;
        const [meeting] = await db.select().from(meetings)
            .where(and(eq(meetings.id, req.params.id), eq(meetings.userId, userId)));
        if (!meeting) return res.status(404).json({ error: 'NOT_FOUND', message: 'Meeting not found' });
        if (!meeting.rawNotes || meeting.rawNotes.trim().length < 20) {
            return res.status(400).json({ error: 'INVALID_INPUT', message: 'Meeting notes are too short to extract items' });
        }

        const extracted = await extractActionItems(meeting.rawNotes);
        const creditResult = await deductCredit(userId);

        const actionItems = extracted.map(item => ({
            id: randomUUID(),
            text: item.text,
            assignee: item.assignee,
            priority: item.priority,
            dueDate: item.suggestedDueDate || undefined,
            status: 'pending' as const,
        }));

        const [updated] = await db.update(meetings)
            .set({ actionItems, status: 'processed', updatedAt: new Date() })
            .where(eq(meetings.id, req.params.id))
            .returning();

        return res.json({
            meeting: updated,
            creditsRemaining: { free: creditResult.freeRemaining, paid: creditResult.paidCredits },
            creditUsed: creditResult.creditType,
        });
    } catch (err: any) {
        if (err instanceof AIAllModelsFailedError || err instanceof AIParseError) throw err;
        return res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
    }
});

// GET /api/meetings/stats — meeting statistics
router.get('/stats/summary', verifyFirebaseToken, async (req: any, res: any) => {
    try {
        const userId = req.user!.uid;
        const allMeetings = await db.select().from(meetings)
            .where(eq(meetings.userId, userId));

        let totalActionItems = 0;
        let completedItems = 0;
        let pendingItems = 0;

        allMeetings.forEach(m => {
            const items = (m.actionItems || []) as any[];
            totalActionItems += items.length;
            completedItems += items.filter(i => i.status === 'done').length;
            pendingItems += items.filter(i => i.status === 'pending' || i.status === 'in_progress').length;
        });

        return res.json({
            totalMeetings: allMeetings.length,
            totalActionItems,
            completedItems,
            pendingItems,
        });
    } catch (err: any) {
        return res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
    }
});

export default router;
