import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import replyRoutes from './routes/reply.js';
import creditsRoutes from './routes/credits.js';
import authRoutes from './routes/auth.js';
import webhookRoutes from './routes/webhook.js';
import templatesRoutes from './routes/templates.js';
import userRoutes from './routes/user.js';
import newsletterRoutes from './routes/newsletter.js';
import meetingsRoutes from './routes/meetings.js';
import adminRoutes from './routes/admin.js';
import blogRoutes from './routes/blog.js';
import { AIAllModelsFailedError, AIParseError } from './services/aiService.js';
import { logger } from './utils/logger.js';

const app = express();
app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({
    origin: (origin, callback) => {
        // Allow no-origin requests (curl, Postman, server-to-server)
        if (!origin) return callback(null, true);
        // Allow Chrome extensions
        if (origin.startsWith('chrome-extension://')) return callback(null, true);
        // Allow all Vercel preview deployments for this project
        if (/^https:\/\/replyai(-client)?(-[a-z0-9]+)*-beetrus-projects\.vercel\.app$/.test(origin)) return callback(null, true);
        if (origin === 'https://replyai-client.vercel.app') return callback(null, true);
        // Allow production domains
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:3000',
            'https://replyai.com.ng',
            'https://www.replyai.com.ng',
            process.env.CLIENT_URL,
        ].filter(Boolean);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        // Return null false (403) not an Error (500)
        callback(null, false);
    },
    credentials: true,
}));

app.use('/api/webhook', express.raw({ type: 'application/json' }), webhookRoutes);
app.use(express.json({ limit: '1mb' }));

// ─── Rate limiting ───────────────────────────────────────────
// Global: generous cap to absorb abuse without hurting real users.
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 600,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
}));
// Strict: auth + payment initiation are brute-force / card-testing targets.
const strictLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'RATE_LIMITED', message: 'Too many attempts. Try again later.' },
});
app.use('/api/auth', strictLimiter);
app.use('/api/credits', strictLimiter);

app.use('/api/reply', replyRoutes);
app.use('/api/credits', creditsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/templates', templatesRoutes);
app.use('/api/user', userRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/meetings', meetingsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/blog', blogRoutes);

app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: Date.now() });
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    logger.error(err.message, err.stack);
    if (err instanceof AIAllModelsFailedError) {
        return res.status(503).json({ error: 'AI_UNAVAILABLE', message: 'AI service temporarily unavailable.' });
    }
    if (err instanceof AIParseError) {
        return res.status(503).json({ error: 'AI_PARSE_ERROR', message: 'AI returned unexpected response. Try again.' });
    }
    if (err.status || err.statusCode) {
        return res.status(err.status || err.statusCode).json({ error: err.name || 'ERROR', message: err.message });
    }
    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred: ' + (err.message || String(err)) });
});

const isVercel = !!process.env.VERCEL;
if (!isVercel) {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        logger.info(`Server listening on port ${PORT}`);
        import('./jobs/drip.js').then(m => m.startDripJobs()).catch(console.error);
    });
}

export default app;
