import { Router } from 'express';
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js';
import { checkCredits } from '../middleware/checkCredits.js';
import { generateRateLimit } from '../middleware/rateLimit.js';
import { generateReplies, AIAllModelsFailedError, AIParseError } from '../services/aiService.js';
import { deductCredit } from '../services/creditsService.js';
import { db } from '../db/index.js';
import { generations } from '../db/schema.js';
import { desc, eq } from 'drizzle-orm';

const router = Router();

router.post('/generate', verifyFirebaseToken, checkCredits, generateRateLimit, async (req: any, res: any, next: any) => {
    try {
        const { emailContent, tone, context, outputLanguage = 'en' } = req.body;

        if (!emailContent || typeof emailContent !== 'string' || emailContent.length > 3000) {
            return res.status(400).json({ error: 'INVALID_INPUT', message: 'emailContent is required and must be under 3000 characters.' });
        }

        const validTones = ['professional', 'friendly', 'firm', 'apologetic', 'custom'];
        if (!tone || !validTones.includes(tone)) {
            return res.status(400).json({ error: 'INVALID_INPUT', message: 'tone must be a valid ToneType.' });
        }

        const validLanguages = ['en', 'pidgin', 'yoruba', 'hausa', 'fr'];
        if (!validLanguages.includes(outputLanguage)) {
            return res.status(400).json({ error: 'INVALID_INPUT', message: 'outputLanguage must be a valid language code.' });
        }

        if (context && (typeof context !== 'string' || context.length > 300)) {
            return res.status(400).json({ error: 'INVALID_INPUT', message: 'context must be under 300 characters.' });
        }

        const userId = req.user!.uid;

        // 1. Generate replies
        const replies = await generateReplies(emailContent, tone, context, outputLanguage as any);

        // 2. Deduct credit
        const creditResult = await deductCredit(userId);

        // 3. Insert row into generations table
        await db.insert(generations).values({
            userId,
            emailSnippet: emailContent.substring(0, 200),
            tone,
            outputLanguage,
            creditType: creditResult.creditType
        });

        // 4. Return response
        return res.json({
            replies,
            creditsRemaining: {
                free: creditResult.freeRemaining,
                paid: creditResult.paidCredits,
            },
            creditUsed: creditResult.creditType
        });
    } catch (err) {
        if (err instanceof AIAllModelsFailedError) {
            return res.status(503).json({
                error: 'AI_UNAVAILABLE',
                message: 'Our AI service is temporarily unavailable. Please try again in a moment.',
            });
        }
        if (err instanceof AIParseError) {
            return res.status(503).json({
                error: 'AI_PARSE_ERROR',
                message: 'The AI returned an unexpected response. Please try again.',
            });
        }
        next(err);
    }
});

router.get('/history', verifyFirebaseToken, async (req: any, res: any, next: any) => {
    try {
        const userId = req.user!.uid;
        const history = await db.select()
            .from(generations)
            .where(eq(generations.userId, userId))
            .orderBy(desc(generations.createdAt))
            .limit(20);

        return res.json(history);
    } catch (err) {
        next(err);
    }
});

router.get('/stats', verifyFirebaseToken, async (req: any, res: any, next: any) => {
    try {
        const userId = req.user!.uid;
        
        // Total generations
        const [totalCount] = await db.select({ count: generations.id }).from(generations).where(eq(generations.userId, userId));
        
        // Tones distribution (simple query for now)
        const allGens = await db.select({ tone: generations.tone, language: generations.outputLanguage }).from(generations).where(eq(generations.userId, userId));
        
        const toneStats = allGens.reduce((acc: any, curr) => {
            acc[curr.tone!] = (acc[curr.tone!] || 0) + 1;
            return acc;
        }, {});

        const langStats = allGens.reduce((acc: any, curr) => {
            acc[curr.language!] = (acc[curr.language!] || 0) + 1;
            return acc;
        }, {});

        return res.json({
            total: allGens.length,
            tones: toneStats,
            languages: langStats
        });
    } catch (err) {
        next(err);
    }
});

export default router;
