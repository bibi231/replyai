import { pgTable, varchar, text, integer, timestamp, uuid, jsonb, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: varchar('id', { length: 128 }).primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    displayName: varchar('display_name', { length: 255 }),
    photoUrl: text('photo_url'),
    freeCreditsUsed: integer('free_credits_used').default(0),
    freeCreditsResetAt: timestamp('free_credits_reset_at'),
    paidCredits: integer('paid_credits').default(0),
    totalGenerations: integer('total_generations').default(0),
    defaultTone: varchar('default_tone', { length: 50 }).default('professional'),
    defaultLanguage: varchar('default_language', { length: 20 }).default('en'),
    showTips: integer('show_tips').default(1),
    platformRole: varchar('platform_role', { length: 20 }), // 'super_admin' | 'admin' | 'editor' | null
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const generations = pgTable('generations', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: varchar('user_id', { length: 128 }).references(() => users.id),
    emailSnippet: text('email_snippet'),
    tone: varchar('tone', { length: 50 }),
    outputLanguage: varchar('output_language', { length: 20 }).default('en'),
    creditType: varchar('credit_type', { length: 20 }),
    createdAt: timestamp('created_at').defaultNow(),
});

export const replyTemplates = pgTable('reply_templates', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: varchar('user_id', { length: 128 }).references(() => users.id),
    title: varchar('title', { length: 255 }).notNull(),
    body: text('body').notNull(),
    tone: varchar('tone', { length: 50 }),
    category: varchar('category', { length: 50 }).default('general'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const meetings = pgTable('meetings', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: varchar('user_id', { length: 128 }).references(() => users.id).notNull(),
    title: varchar('title', { length: 500 }).notNull(),
    date: timestamp('date').notNull(),
    rawNotes: text('raw_notes').notNull(),
    summary: text('summary'),
    actionItems: jsonb('action_items').$type<ActionItem[]>().default([]),
    tags: jsonb('tags').$type<string[]>().default([]),
    status: varchar('status', { length: 20 }).default('draft'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export interface ActionItem {
    id: string;
    text: string;
    assignee: string;
    dueDate?: string;
    status: 'pending' | 'in_progress' | 'done';
    priority: 'low' | 'medium' | 'high';
}

export const payments = pgTable('payments', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: varchar('user_id', { length: 128 }).references(() => users.id),
    paystackRef: varchar('paystack_ref', { length: 255 }).unique(),
    amount: integer('amount'),
    currency: varchar('currency', { length: 10 }).default('NGN'),
    gateway: varchar('gateway', { length: 20 }).default('paystack'),
    credits: integer('credits'),
    status: varchar('status', { length: 20 }).default('pending'),
    pack: varchar('pack', { length: 50 }),
    createdAt: timestamp('created_at').defaultNow(),
});

export const blogComments = pgTable('blog_comments', {
    id: uuid('id').primaryKey().defaultRandom(),
    postSlug: varchar('post_slug', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    content: text('content').notNull(),
    approved: boolean('approved').default(false),
    createdAt: timestamp('created_at').defaultNow(),
});

export const blogPosts = pgTable('blog_posts', {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    title: varchar('title', { length: 500 }).notNull(),
    excerpt: text('excerpt').notNull(),
    content: text('content').notNull(),
    author: varchar('author', { length: 255 }).notNull().default('ReplyAI Team'),
    tags: jsonb('tags').$type<string[]>().default([]),
    readingTime: integer('reading_time').default(5),
    published: boolean('published').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
