import { pgTable, varchar, text, integer, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: varchar('id', { length: 128 }).primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    displayName: varchar('display_name', { length: 255 }),
    photoUrl: text('photo_url'),
    freeCreditsUsed: integer('free_credits_used').default(0),
    freeCreditsResetAt: timestamp('free_credits_reset_at'),
    paidCredits: integer('paid_credits').default(0),
    totalGenerations: integer('total_generations').default(0),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const generations = pgTable('generations', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: varchar('user_id', { length: 128 }).references(() => users.id),
    emailSnippet: text('email_snippet'),
    tone: varchar('tone', { length: 50 }),
    creditType: varchar('credit_type', { length: 20 }),
    createdAt: timestamp('created_at').defaultNow(),
});

export const payments = pgTable('payments', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: varchar('user_id', { length: 128 }).references(() => users.id),
    paystackRef: varchar('paystack_ref', { length: 255 }).unique(),
    amount: integer('amount'),
    credits: integer('credits'),
    status: varchar('status', { length: 20 }).default('pending'),
    pack: varchar('pack', { length: 50 }),
    createdAt: timestamp('created_at').defaultNow(),
});
