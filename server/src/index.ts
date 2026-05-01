import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import replyRoutes from './routes/reply.js';
import creditsRoutes from './routes/credits.js';
import authRoutes from './routes/auth.js';
import webhookRoutes from './routes/webhook.js';
import templatesRoutes from './routes/templates.js';
import userRoutes from './routes/user.js';
import { AIAllModelsFailedError, AIParseError } from './services/aiService.js';
import { logger } from './utils/logger.js';

dotenv.config();

const app = express();

// Security headers and CORS
app.use(helmet());
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            process.env.CLIENT_URL || 'http://localhost:5173',
            'http://localhost:5173',
            'https://replyai.com.ng',
            'https://www.replyai.com.ng',
            'https://replyai-client.vercel.app',
        ];
        if (!origin) return callback(null, true);
        if (origin.startsWith('chrome-extension://')) return callback(null, true);
        if (/^https:\/\/replyai-client-[a-z0-9-]+\.vercel\.app$/.test(origin)) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));

app.use('/api/webhook', express.raw({ type: 'application/json' }), webhookRoutes);
app.use(express.json());

app.use('/api/reply', replyRoutes);
app.use('/api/credits', creditsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/templates', templatesRoutes);
app.use('/api/user', userRoutes);

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
    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred.' });
});

const isVercel = !!process.env.VERCEL;
if (!isVercel) {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        logger.info(`Server listening on port ${PORT}`);
    });
}

export default app;
