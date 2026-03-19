import { Request, Response, NextFunction } from 'express';
import { checkCredits as checkUserCredits } from '../services/creditsService.js';

export async function checkCredits(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.uid;
    if (!userId) {
        res.status(401).json({ error: 'UNAUTHORIZED', message: 'User not authenticated' });
        return;
    }

    try {
        const status = await checkUserCredits(userId);
        if (!status.canGenerate) {
            res.status(402).json({
                error: 'INSUFFICIENT_CREDITS',
                message: 'You have run out of credits.',
                freeRemaining: status.freeRemaining,
                paidCredits: status.paidCredits
            });
            return;
        }
        next();
    } catch (err) {
        next(err);
    }
}
