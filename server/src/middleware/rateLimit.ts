import rateLimit from 'express-rate-limit';

export const generateRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            error: 'RATE_LIMITED',
            message: 'Too many requests. Try again in a few minutes.'
        });
    }
});
