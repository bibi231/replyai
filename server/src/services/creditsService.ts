import { db } from '../db/index.js';
import { users, payments } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const FREE_MONTHLY_CREDITS = 5;

export async function checkCredits(userId: string): Promise<{
    canGenerate: boolean;
    freeRemaining: number;
    paidCredits: number;
    resetDate: Date | null;
    reason?: string;
}> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) {
        return { canGenerate: false, freeRemaining: 0, paidCredits: 0, resetDate: null, reason: 'User not found' };
    }

    const now = new Date();
    let resetDate = user.freeCreditsResetAt ? new Date(user.freeCreditsResetAt) : null;
    let freeUsed = user.freeCreditsUsed || 0;

    if (!resetDate || resetDate.getMonth() !== now.getMonth() || resetDate.getFullYear() !== now.getFullYear()) {
        freeUsed = 0;
        resetDate = now;
    }

    const freeRemaining = Math.max(0, FREE_MONTHLY_CREDITS - freeUsed);
    const paidCredits = user.paidCredits || 0;
    const canGenerate = freeRemaining > 0 || paidCredits > 0;

    return {
        canGenerate,
        freeRemaining,
        paidCredits,
        resetDate,
        reason: canGenerate ? undefined : 'INSUFFICIENT_CREDITS',
    };
}

export async function deductCredit(userId: string): Promise<{
    creditType: 'free' | 'paid';
    freeRemaining: number;
    paidCredits: number;
}> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) throw new Error('User not found');

    const now = new Date();
    let resetDate = user.freeCreditsResetAt ? new Date(user.freeCreditsResetAt) : null;
    let freeUsed = user.freeCreditsUsed || 0;

    if (!resetDate || resetDate.getMonth() !== now.getMonth() || resetDate.getFullYear() !== now.getFullYear()) {
        freeUsed = 0;
        resetDate = now;
    }

    const freeRemaining = Math.max(0, FREE_MONTHLY_CREDITS - freeUsed);
    let creditType: 'free' | 'paid';
    let updateData: any = {
        totalGenerations: (user.totalGenerations || 0) + 1,
        updatedAt: now,
    };

    if (freeRemaining > 0) {
        creditType = 'free';
        updateData.freeCreditsUsed = freeUsed + 1;
        updateData.freeCreditsResetAt = resetDate;
    } else if ((user.paidCredits || 0) > 0) {
        creditType = 'paid';
        updateData.paidCredits = user.paidCredits! - 1;
    } else {
        throw new Error('No credits available');
    }

    await db.update(users).set(updateData).where(eq(users.id, userId));

    return {
        creditType,
        freeRemaining: creditType === 'free' ? freeRemaining - 1 : 0,
        paidCredits: creditType === 'paid' ? (user.paidCredits || 0) - 1 : (user.paidCredits || 0),
    };
}

export async function addPaidCredits(
    userId: string,
    credits: number,
    paystackRef: string,
    pack: string,
    amountKobo: number
): Promise<void> {
    await db.transaction(async (tx) => {
        const [existing] = await tx.select().from(payments).where(eq(payments.paystackRef, paystackRef));
        if (existing && existing.status === 'success') {
            return;
        }

        if (existing) {
            await tx.update(payments).set({ status: 'success' }).where(eq(payments.paystackRef, paystackRef));
        } else {
            await tx.insert(payments).values({
                userId,
                paystackRef,
                amount: amountKobo,
                credits,
                status: 'success',
                pack,
            });
        }

        const [user] = await tx.select().from(users).where(eq(users.id, userId));
        if (user) {
            await tx.update(users)
                .set({ paidCredits: (user.paidCredits || 0) + credits, updatedAt: new Date() })
                .where(eq(users.id, userId));
        }
    });
}

export async function upsertUser(
    uid: string,
    email: string,
    displayName?: string,
    photoUrl?: string
): Promise<void> {
    const [existingUser] = await db.select().from(users).where(eq(users.id, uid));
    if (!existingUser) {
        await db.insert(users).values({
            id: uid,
            email,
            displayName,
            photoUrl,
            freeCreditsResetAt: new Date(),
        } as any);
    } else {
        await db.update(users).set({
            email,
            displayName: displayName || existingUser.displayName,
            photoUrl: photoUrl || existingUser.photoUrl,
            updatedAt: new Date()
        } as any).where(eq(users.id, uid));
    }
}
