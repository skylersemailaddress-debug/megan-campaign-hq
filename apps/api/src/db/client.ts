import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

export const db = connectionString
  ? new Pool({ connectionString })
  : null;

export async function query<T = unknown>(text: string, params: unknown[] = []): Promise<T[]> {
  if (!db) {
    throw new Error('DATABASE_URL is not configured');
  }
  const result = await db.query(text, params);
  return result.rows as T[];
}
