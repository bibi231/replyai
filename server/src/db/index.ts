import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-kit/utils'; // Wait, standard drizzle for neon is different
import * as schema from './schema';
import { drizzle as nodeDrizzle } from 'drizzle-orm/neon-http';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
}

const sql = neon(process.env.DATABASE_URL);
export const db = nodeDrizzle(sql, { schema });
