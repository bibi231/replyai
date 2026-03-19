import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import replyRoutes from './routes/reply.js';
import creditsRoutes from './routes/credits.js';
import authRoutes from './routes/auth.js';
import webhookRoutes from './routes/webhook.js';
import { GeminiParseError } from './utils/errors.js';
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
        ];
        // Allow requests with no origin (mobile apps, curl, extensions)
        if (!origin) return callback(null, true);
        // Allow chrome-extension:// origins
        if (origin.startsWith('chrome-extension://')) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));

// Webhook route needs raw body for signature verification
app.use('/api/webhook', express.raw({ type: 'application/json' }), webhookRoutes);

// Other routes need JSON body parser
app.use(express.json());

// API Routes
app.use('/api/reply', replyRoutes);
app.use('/api/credits', creditsRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: Date.now() });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message, err.stack);

    if (err instanceof GeminiParseError) {
        return res.status(503).json({ error: 'GEMINI_ERROR', message: err.message });
    }

    // Handle other knowable errors like generic validation or status
    if (err.status || err.statusCode) {
        return res.status(err.status || err.statusCode).json({ error: err.name || 'ERROR', message: err.message });
    }

    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred.' });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
});
