import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

export function verifyPaystackSignature(payload: string, signature: string): boolean {
    const secret = process.env.PAYSTACK_SECRET_KEY || '';
    const hash = crypto.createHmac('sha512', secret).update(payload).digest('hex');
    return hash === signature;
}
