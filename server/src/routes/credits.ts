import { Router } from 'express';
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js';
import { checkCredits as getCreditsStatus } from '../services/creditsService.js';

const router = Router();

router.get('/', verifyFirebaseToken, async (req: any, res: any, next: any) => {
    try {
        const userId = req.user!.uid;
        const status = await getCreditsStatus(userId);
        return res.json(status);
    } catch (err) {
        next(err);
    }
});

// ── GTSquad checkout — hosted payment link (handles NGN + USD) ────────────────
const SQUAD_LINKS_REPLYAI: Record<string, string> = {
    starter: 'https://pay.squadco.com/link/ZYG21V',
    pro:     'https://pay.squadco.com/link/EDV8LC',
    power:   'https://pay.squadco.com/link/N7ZHGQ',
};

router.post('/gtsquad-checkout', verifyFirebaseToken, async (req: any, res: any, next: any) => {
    try {
        const { packId } = req.body;
        const email: string = req.user!.email || '';
        const baseUrl = SQUAD_LINKS_REPLYAI[packId as string];
        if (!baseUrl) return res.status(400).json({ message: 'Invalid pack' });
        const checkoutUrl = email ? `${baseUrl}?email=${encodeURIComponent(email)}` : baseUrl;
        return res.json({ checkoutUrl });
    } catch (err) {
        next(err);
    }
});

export default router;
