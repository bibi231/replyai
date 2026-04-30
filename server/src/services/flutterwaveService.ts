import crypto from 'crypto';

export function verifyFlutterwaveSignature(payload: string, signature: string) {
    const secret = process.env.FLW_SECRET_HASH || 'FLW_SECRET_HASH_HERE';
    return signature === secret;
}
