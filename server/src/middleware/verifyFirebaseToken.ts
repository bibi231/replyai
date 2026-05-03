import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

if (!admin.apps.length) {
    try {
        if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID.trim(),
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL?.trim(),
                    privateKey: process.env.FIREBASE_PRIVATE_KEY.trim().replace(/\\n/g, '\n')
                })
            });
            console.log('[Firebase] Admin initialized using individual keys');
        } else if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
            // Handle both raw JSON and base64-encoded JSON
            let raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON.trim();
            // Replace literal \n with actual newlines in private_key
            const serviceAccount = JSON.parse(raw);
            if (serviceAccount.private_key) {
                serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
            }
            admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
            console.log('[Firebase] Admin initialized using JSON');
        } else {
            console.error('[Firebase] Credentials not provided — auth will fail');
        }
    } catch (error) {
        console.error('[Firebase] Failed to initialize admin SDK:', error);
    }
}

declare global {
    namespace Express {
        interface Request {
            user?: admin.auth.DecodedIdToken;
        }
    }
}

export async function verifyFirebaseToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'UNAUTHORIZED', message: 'No token provided' });
        return;
    }

    const token = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (err: any) {
        console.error('Token Error:', err.message);
        res.status(401).json({ error: 'UNAUTHORIZED', message: 'Invalid token', details: err.message });
    }
}
